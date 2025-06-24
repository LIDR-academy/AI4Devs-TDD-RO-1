import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../../infrastructure/db/prisma';

// Creamos un mock profundo del cliente de Prisma
export const prismaMock: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

// Interceptamos el módulo que exporta prisma para devolver siempre nuestro mock
jest.mock('../../infrastructure/db/prisma', () => ({
  prisma: prismaMock
}));
