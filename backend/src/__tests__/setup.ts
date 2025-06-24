// Configuración global para tests del backend
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

// Configuraciones adicionales para tests
global.console = {
  ...console,
  // Silenciar logs en tests
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Solo aplicar mock de Prisma si no estamos en tests E2E
const isE2ETest = process.env.NODE_ENV === 'e2e' || 
                  process.argv.includes('--testPathPattern=e2e') ||
                  process.argv.some(arg => arg.includes('e2e'));

if (!isE2ETest) {
  // Mock de Prisma para tests unitarios
  jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
      candidate: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
      education: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
      workExperience: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
      resume: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    })),
  }));
} 