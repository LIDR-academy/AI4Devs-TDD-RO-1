import { PrismaClient } from '@prisma/client';

// Cliente centralizado de Prisma
export const prisma = new PrismaClient();
