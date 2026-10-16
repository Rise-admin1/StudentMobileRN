import prisma from '../lib/prisma.js';

const socketsByUser = new Map();
let io = null;

export const attachIo = (server) => {
  io = server;
};

export const isOnline = (userId) => {
  const sockets = socketsByUser.get(userId);
  return Boolean(sockets && sockets.size > 0);
};

const partnerUserIds = async (userId) => {
  const [direct, parentThreads] = await Promise.all([
    prisma.conversation.findMany({
      where: {
        OR: [
          { student: { userId } },
          { teacher: { userId } },
        ],
      },
      select: {
        student: { select: { userId: true } },
        teacher: { select: { userId: true } },
      },
    }),
    prisma.parentConversation.findMany({
      where: {
        OR: [
          { parent: { userId } },
          { teacher: { userId } },
        ],
      },
      select: {
        parent: { select: { userId: true } },
        teacher: { select: { userId: true } },
      },
    }),
  ]);

  const ids = new Set();
  for (const row of direct) {
    if (row.student?.userId && row.student.userId !== userId) ids.add(row.student.userId);
    if (row.teacher?.userId && row.teacher.userId !== userId) ids.add(row.teacher.userId);
  }
  for (const row of parentThreads) {
    if (row.parent?.userId && row.parent.userId !== userId) ids.add(row.parent.userId);
    if (row.teacher?.userId && row.teacher.userId !== userId) ids.add(row.teacher.userId);
  }
  return ids;
};

const emitPresence = async (userId, online, lastSeenAt) => {
  if (!io) return;
  const partners = await partnerUserIds(userId);
  const payload = {
    userId,
    online,
    lastSeenAt: lastSeenAt ? new Date(lastSeenAt).toISOString() : null,
  };
  for (const partnerId of partners) {
    io.to(`user:${partnerId}`).emit('presence-update', payload);
  }
};

export const handleConnect = async (socket) => {
  const userId = socket.userId;
  if (!userId) return;

  socket.join(`user:${userId}`);

  let sockets = socketsByUser.get(userId);
  const wasOnline = Boolean(sockets && sockets.size > 0);
  if (!sockets) {
    sockets = new Set();
    socketsByUser.set(userId, sockets);
  }
  sockets.add(socket.id);
  if (wasOnline) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastSeenAt: true },
  });
  await emitPresence(userId, true, user?.lastSeenAt ?? null);
};

export const handleDisconnect = async (socket) => {
  const userId = socket.userId;
  if (!userId) return;

  const sockets = socketsByUser.get(userId);
  if (!sockets) return;

  sockets.delete(socket.id);
  if (sockets.size > 0) return;

  socketsByUser.delete(userId);
  const lastSeenAt = new Date();
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastSeenAt },
    });
  } catch (err) {
    console.error('Failed to store last seen', err);
  }
  await emitPresence(userId, false, lastSeenAt);
};
