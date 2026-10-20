import prisma from '../lib/prisma.js';
import { sendOpsNotifyEmail } from '../utils/opsNotify.js';

const FLUSH_MS = 2000;
const FLUSH_SIZE = 50;
const MAX_BUFFER = 1000;
const RETENTION_MS = 14 * 24 * 60 * 60 * 1000;
const DELETE_BATCH = 5000;
const RETENTION_INTERVAL_MS = 60 * 60 * 1000;

const buffer = [];
let flushTimer = null;
let flushing = false;

export function redactPath(rawUrl) {
  const pathOnly = String(rawUrl || '/').split('?')[0] || '/';
  return pathOnly
    .replace(/^\/api\/auth\/verify\/[^/]+/, '/api/auth/verify/:token')
    .slice(0, 300);
}

function previewJson(value) {
  if (value == null) return '';
  const json = JSON.stringify(value);
  if (!json) return '';
  return json.length > 700 ? `${json.slice(0, 700)}…` : json;
}

const ASSET_NAME = 'Coach Academ';

const ROUTE_NOTES = [
  ['/api/auth/super-admin/login', 'Signs in a Coach Academ admin.'],
  ['/api/auth/register', 'Creates a student, teacher, parent, or organization account.'],
  ['/api/auth/login', 'Signs in a verified user and starts a session.'],
  ['/api/auth/verify', 'Confirms an email verification link.'],
  ['/api/auth/forgot-password', 'Sends a password reset email.'],
  ['/api/auth/reset-password', 'Sets a new password from a reset token.'],
  ['/api/auth', 'Account, profile, and organization actions.'],
  ['/api/subjects', 'Course catalog, course detail, creation, and verification.'],
  ['/api/enrollments', 'Joining or leaving a course.'],
  ['/api/stripe-webhook', 'Stripe payment webhook.'],
  ['/api/stripe', 'Card payments and purchase checks.'],
  ['/api/stripe-onboard', 'Teacher Stripe onboarding.'],
  ['/api/bookings', 'Class booking and availability.'],
  ['/api/zoom/webhook', 'Zoom webhook.'],
  ['/api/zoom', 'Zoom meeting setup.'],
  ['/api/conversation', 'Chat conversations.'],
  ['/api/message', 'Chat messages.'],
  ['/api/community', 'Community rooms.'],
  ['/api/parent', 'Parent links and parent chat.'],
  ['/api/student', 'Student responses to parent invites.'],
  ['/api/billing', 'Student or parent billing.'],
  ['/api/reports', 'Abuse reports and blocked users.'],
  ['/api/reviews', 'Course reviews.'],
  ['/api/student-ratings', 'Student ratings.'],
  ['/api/s3', 'File uploads.'],
  ['/api/admin/request-logs', 'This error log reader.'],
  ['/api/admin', 'Coach Academ admin lists.'],
  ['/api/app', 'App version check.'],
].sort((a, b) => b[0].length - a[0].length);

function routeNote(path) {
  const match = ROUTE_NOTES.find(([prefix]) => path === prefix || path.startsWith(`${prefix}/`));
  return match ? match[1] : 'Coach Academ API request.';
}

function emailRequestLog(entry) {
  sendOpsNotifyEmail({
    subject: `Coach Academ ${entry.statusCode} ${entry.method} ${entry.path}`,
    title: 'API error',
    intro: 'An API request failed on Coach Academ.',
    rows: [
      ['Method', entry.method],
      ['Path', entry.path],
      ['Status', String(entry.statusCode)],
      ['Duration', `${entry.durationMs} ms`],
      ['IP', entry.ip || ''],
      ['User', entry.actorUserId || ''],
      ['Email', entry.email || ''],
      ['Account type', entry.accountType || ''],
      ['Error', entry.errorMessage || ''],
      ['Headers', previewJson(entry.requestHeaders)],
      ['Data', previewJson(entry.requestBody)],
    ],
  });
}

function contextMessage(entry) {
  return JSON.stringify({
    asset: ASSET_NAME,
    method: entry.method,
    path: entry.path,
    route: routeNote(entry.path),
    status: entry.statusCode,
    error: entry.errorMessage,
    email: entry.email,
    accountType: entry.accountType,
    headers: entry.requestHeaders,
    data: entry.requestBody,
  });
}

async function completeConversation(entry, thread) {
  const apiKey = (process.env.OPENAI_API_KEY || '').trim();
  if (!apiKey) {
    const error = new Error('OPENAI_API_KEY is not set');
    error.status = 503;
    throw error;
  }
  const model = (process.env.OPENAI_MODEL || 'gpt-4o-mini').trim();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 400,
        messages: [
          {
            role: 'system',
            content: `You explain why this ${ASSET_NAME} API error happened. Use the route context below. Answer the operator's question. Do not suggest code changes unless they ask. ${contextMessage(entry)}`,
          },
          ...thread.map((message) => ({ role: message.role, content: message.content })),
        ],
      }),
    });
    const body = await response.json().catch(() => null);
    const text = body?.choices?.[0]?.message?.content;
    if (!response.ok || typeof text !== 'string' || !text.trim()) {
      const error = new Error(body?.error?.message || 'OpenAI request failed');
      error.status = 502;
      throw error;
    }
    return text.trim().slice(0, 4000);
  } finally {
    clearTimeout(timer);
  }
}

export async function askRequestLogAi(log, message) {
  const existing = Array.isArray(log.aiMessages) ? log.aiMessages : [];
  const text = String(message || '').trim() || (existing.length === 0 ? 'Why did this error happen?' : '');
  if (!text) {
    const error = new Error('Message is required');
    error.status = 400;
    throw error;
  }
  const userMessage = {
    role: 'user',
    content: text.slice(0, 2000),
    createdAt: new Date().toISOString(),
  };
  const thread = [...existing, userMessage].slice(-40);
  const reply = await completeConversation(log, thread);
  const aiMessages = [
    ...thread,
    { role: 'assistant', content: reply, createdAt: new Date().toISOString() },
  ];
  await prisma.apiRequestLog.update({
    where: { id: log.id },
    data: { aiMessages },
  });
  return aiMessages;
}

export function enqueueRequestLog(entry) {
  emailRequestLog(entry);
  buffer.push(entry);
  if (buffer.length > MAX_BUFFER) {
    buffer.splice(0, buffer.length - MAX_BUFFER);
  }
  if (buffer.length >= FLUSH_SIZE) {
    flushRequestLogs().catch((error) => {
      console.error('Failed to flush request logs', error);
    });
    return;
  }
  if (!flushTimer) {
    flushTimer = setTimeout(() => {
      flushTimer = null;
      flushRequestLogs().catch((error) => {
        console.error('Failed to flush request logs', error);
      });
    }, FLUSH_MS);
    if (typeof flushTimer.unref === 'function') flushTimer.unref();
  }
}

export async function flushRequestLogs() {
  if (flushing || buffer.length === 0) return;
  flushing = true;
  const batch = buffer.splice(0, buffer.length);
  try {
    await prisma.apiRequestLog.createMany({ data: batch });
  } catch (error) {
    console.error('Failed to flush request logs', error);
  } finally {
    flushing = false;
    if (buffer.length >= FLUSH_SIZE) {
      flushRequestLogs().catch((flushError) => {
        console.error('Failed to flush request logs', flushError);
      });
    }
  }
}

export async function deleteExpiredRequestLogs() {
  const cutoff = new Date(Date.now() - RETENTION_MS);
  try {
    for (;;) {
      const removed = await prisma.$executeRawUnsafe(
        'DELETE FROM `api_request_logs` WHERE `createdAt` < ? ORDER BY `createdAt` ASC LIMIT 5000',
        cutoff
      );
      if (!removed || Number(removed) < DELETE_BATCH) break;
    }
  } catch (error) {
    console.error('Failed to delete expired request logs', error);
  }
}

export function startRequestLogRetention() {
  deleteExpiredRequestLogs().catch((error) => {
    console.error('Failed to delete expired request logs', error);
  });
  const timer = setInterval(() => {
    deleteExpiredRequestLogs().catch((error) => {
      console.error('Failed to delete expired request logs', error);
    });
  }, RETENTION_INTERVAL_MS);
  if (typeof timer.unref === 'function') timer.unref();
}
