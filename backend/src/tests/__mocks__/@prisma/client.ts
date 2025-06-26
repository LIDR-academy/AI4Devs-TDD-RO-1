// Definir clases mock para los errores de Prisma para que instanceof funcione
export class MockPrismaClientInitializationError extends Error {
    constructor() {
        super('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
        this.name = 'PrismaClientInitializationError';
    }
}

export class MockPrismaClientKnownRequestError extends Error {
    code: string;
    meta?: object;
    constructor(code: string, meta?: object) {
        super('No se pudo encontrar el registro del candidato con el ID proporcionado.');
        this.name = 'PrismaClientKnownRequestError';
        this.code = code;
        this.meta = meta;
    }
}

// Mock de PrismaClient
export const prismaMock = {
    candidate: {
        create: jest.fn(),
        update: jest.fn(),
    },
};

// Exportar Prisma y las clases de error mockeadas
export const PrismaClient = jest.fn(() => prismaMock);
export const Prisma = {
    PrismaClientInitializationError: MockPrismaClientInitializationError,
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
    // Otros errores de Prisma si son necesarios
}; 