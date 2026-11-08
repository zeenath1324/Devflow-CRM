import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    try {
      prismaInstance = new PrismaClient();
    } catch (e) {
      console.warn('Prisma client initialization notice:', e);
    }
  }
  return prismaInstance!;
}

export const prisma = getPrismaClient();
