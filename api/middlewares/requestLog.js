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

const SECRET_HEADERS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'proxy-authorization',
]);
const SECRET_KEY = /password|token|secret|authorization|cookie/i;
const MAX_JSON_CHARS = 12000;

function redactDeep(key, value) {
  if (SECRET_KEY.test(key)) return '[redacted]';
  if (Array.isArray(value)) return value.slice(0, 50).map((item) => redactDeep('', item));
  if (value && typeof value === 'object') {
    if (Buffer.isBuffer(value)) return `[binary, ${value.length} bytes]`;
    const out = {};
    for (const [childKey, childValue] of Object.entries(value)) {
      out[childKey] = redactDeep(childKey, childValue);
    }
    return out;
  }
  if (typeof value === 'string' && value.length > 2000) return `${value.slice(0, 2000)}…`;
  return value ?? null;
}

function fitJson(value) {
  if (value == null) return null;
  const json = JSON.stringify(value);
  if (!json || json === '{}' || json === 'null') return null;
  if (json.length <= MAX_JSON_CHARS) return value;
  return { _truncated: true, preview: json.slice(0, MAX_JSON_CHARS) };
}

function captureHeaders(req) {
  const headers = {};
  for (const [key, value] of Object.entries(req.headers || {})) {
    if (SECRET_HEADERS.has(key.toLowerCase())) {
      headers[key] = '[redacted]';
      continue;
    }
    const text = Array.isArray(value) ? value.join(', ') : String(value ?? '');
    headers[key] = text.length > 500 ? `${text.slice(0, 500)}…` : text;
  }
  return fitJson(headers);
}

function captureBody(req) {
  const query = req.query && typeof req.query === 'object' && Object.keys(req.query).length
    ? redactDeep('query', req.query)
    : null;
  let body = null;
  if (Buffer.isBuffer(req.body)) {
    body = `[binary, ${req.body.length} bytes]`;
  } else if (typeof req.body === 'string' && req.body.trim()) {
    try {
      body = redactDeep('body', JSON.parse(req.body));
    } catch {
      body = req.body.slice(0, 4000);
    }
  } else if (req.body && typeof req.body === 'object' && !Array.isArray(req.body) && Object.keys(req.body).length) {
    body = redactDeep('body', req.body);
  } else if (Array.isArray(req.body)) {
    body = redactDeep('body', req.body);
  }

  if (query == null && body == null) return null;
  return fitJson({ query, body });
}

function captureErrorMessage(res) {
  if ((res.statusCode || 0) < 400) return null;
  const message = res.locals.requestLogMessage;
  return typeof message === 'string' && message.trim() ? message.trim().slice(0, 200) : null;
}

export function requestLogMiddleware(req, res, next) {
  const path = redactPath(req.originalUrl || req.url || '/');
  if (
    path === '/health' ||
    (req.method === 'GET' && path === '/api/admin/request-logs')
  ) {
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
    const statusCode = res.statusCode || 0;
    if (statusCode < 400) return;

    const durationMs = Math.max(0, Math.round(Number(process.hrtime.bigint() - started) / 1e6));
    const authFields = copyAuthFields(req, path);
    enqueueRequestLog({
      method: String(req.method || 'GET').slice(0, 16),
      path,
      statusCode,
      durationMs,
      ip: clientIp(req),
      actorUserId: actorUserId(req),
      email: authFields.email,
      accountType: authFields.accountType,
      errorMessage: captureErrorMessage(res),
      requestHeaders: captureHeaders(req),
      requestBody: captureBody(req),
    });
  });

  return next();
}
