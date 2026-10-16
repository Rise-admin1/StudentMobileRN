import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const CONNECTION_LIMIT = 5;

const withConnectionLimit = (rawUrl) => {
  if (!rawUrl) return rawUrl;
  if (/[?&]connection_limit=/.test(rawUrl)) return rawUrl;
  const join = rawUrl.includes('?') ? '&' : '?';
  return `${rawUrl}${join}connection_limit=${CONNECTION_LIMIT}`;
};

const databaseUrl = withConnectionLimit(process.env.DATABASE_URL);

const prisma = globalThis.prisma ?? new PrismaClient(
  databaseUrl ? { datasources: { db: { url: databaseUrl } } } : undefined
);

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
