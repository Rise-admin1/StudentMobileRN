import jwt from 'jsonwebtoken';
import { enqueueRequestLog, redactPath } from '../services/requestLog.js';

const AUTH_POST_PATHS = new Set(['/api/auth/register', '/api/auth/login']);

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (typeof raw === 'string' && raw.trim()) {
    return raw.split(',')[0].trim().slice(0, 64);
  }
  const ip = req.ip || req.socket?.remoteAddress || '';
  return ip ? String(ip).slice(0, 64) : null;
}

function actorUserId(req) {
  const header = req.headers.authorization;
  if (!header || typeof header !== 'string' || !header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  if (!token) return null;
  const payload = jwt.decode(token);
  if (!payload || typeof payload !== 'object' || typeof payload.userId !== 'string') return null;
  return payload.userId.slice(0, 64);
}

function copyAuthFields(req, path) {
  if (req.method !== 'POST' || !AUTH_POST_PATHS.has(path)) {
    return { email: null, accountType: null };
  }
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { email: null, accountType: null };
  }
  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 255) : '';
  const accountType = typeof body.userType === 'string' ? body.userType.trim().slice(0, 32) : '';
  return {
    email: email || null,
    accountType: accountType || null,
  };
}

function captureErrorMessage(res) {
  if ((res.statusCode || 0) < 400) return null;
  const message = res.locals.requestLogMessage;
  return typeof message === 'string' && message.trim() ? message.trim().slice(0, 200) : null;
}

export function requestLogMiddleware(req, res, next) {
  const path = redactPath(req.originalUrl || req.url || '/');
  if (req.method === 'GET' && path === '/api/admin/request-logs') {
    return next();
  }

  const started = process.hrtime.bigint();
  const rememberMessage = (body) => {
    if (res.locals.requestLogMessage) return;
    if (typeof body === 'string') {
      const trimmed = body.trim();
      if (!trimmed || trimmed.length > 2000) return;
      try {
        rememberMessage(JSON.parse(trimmed));
      } catch {
        res.locals.requestLogMessage = trimmed.slice(0, 200);
      }
      return;
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return;
    const message = typeof body.message === 'string'
      ? body.message
      : typeof body.error === 'string'
        ? body.error
        : '';
    if (message) res.locals.requestLogMessage = message.slice(0, 200);
  };
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    rememberMessage(body);
    return originalJson(body);
  };
  const originalSend = res.send.bind(res);
  res.send = (body) => {
    rememberMessage(body);
    return originalSend(body);
  };

  res.on('finish', () => {
    const durationMs = Math.max(0, Math.round(Number(process.hrtime.bigint() - started) / 1e6));
    const authFields = copyAuthFields(req, path);
    enqueueRequestLog({
      method: String(req.method || 'GET').slice(0, 16),
      path,
      statusCode: res.statusCode || 0,
      durationMs,
      ip: clientIp(req),
      actorUserId: actorUserId(req),
      email: authFields.email,
      accountType: authFields.accountType,
      errorMessage: captureErrorMessage(res),
    });
  });

  return next();
}
