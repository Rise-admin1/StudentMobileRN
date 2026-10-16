import crypto from 'crypto';
import prisma from '../lib/prisma.js';
import { endUserSessionSockets } from './presence.js';

export async function sessionIsCurrent(payload) {
  if (payload?.userType === 'ADMIN') return true;
  if (!payload?.userId || !payload?.sessionId) return false;
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { activeSessionId: true },
  });
  return Boolean(user && user.activeSessionId === payload.sessionId);
}

export async function revokeUserSession(userId) {
  await prisma.user.update({
    where: { id: userId },
    data: { activeSessionId: null, pushToken: null },
  });
  endUserSessionSockets(userId);
}

export async function startUserSession(userId) {
  const sessionId = crypto.randomUUID();
  await prisma.user.update({
    where: { id: userId },
    data: { activeSessionId: sessionId, pushToken: null },
  });
  endUserSessionSockets(userId);
  return sessionId;
}
