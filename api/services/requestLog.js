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
