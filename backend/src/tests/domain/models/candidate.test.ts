import { Candidate } from 'domain/models/Candidate';
import { prismaMock, MockPrismaClientInitializationError, MockPrismaClientKnownRequestError } from '../../__mocks__/@prisma/client';

// NO MOCK DE PRISMA CLIENT AQUÍ: Se gestiona en __mocks__/@prisma/client.ts

describe('Candidate', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('save', () => {
        it('debería crear un nuevo candidato con datos básicos y devolver el candidato creado', async () => {
            const candidateData = {
                firstName: 'Test',
                lastName: 'Candidate',
                email: 'test.candidate@example.com',
                phone: '1234567890',
                address: '123 Test St',
            };

            const mockPrismaCreateResult = { id: 1, ...candidateData };
            (prismaMock.candidate.create as jest.Mock).mockResolvedValue(mockPrismaCreateResult);

            const candidate = new Candidate(candidateData);
            const savedCandidate = await candidate.save();

            // Verificaciones
            expect(prismaMock.candidate.create).toHaveBeenCalledTimes(1);
            expect(prismaMock.candidate.create).toHaveBeenCalledWith({
                data: {
                    firstName: 'Test',
                    lastName: 'Candidate',
                    email: 'test.candidate@example.com',
                    phone: '1234567890',
                    address: '123 Test St',
                },
            });
            expect(savedCandidate).toEqual(mockPrismaCreateResult);
        });

        it('debería crear un nuevo candidato con relaciones anidadas y devolver el candidato creado', async () => {
            const candidateDataWithRelations = {
                firstName: 'Test',
                lastName: 'Relations',
                email: 'test.relations@example.com',
                educations: [
                    { institution: 'Uni', title: 'Degree', startDate: '2020-01-01', endDate: '2024-12-31' }
                ],
                workExperiences: [
                    { company: 'Comp', position: 'Dev', description: 'Desc', startDate: '2019-01-01', endDate: '2023-12-31' }
                ],
                resumes: [
                    { filePath: 'path/to/resume.pdf', fileType: 'application/pdf' }
                ]
            };

            const mockPrismaCreateResult = { id: 2, ...candidateDataWithRelations };
            (prismaMock.candidate.create as jest.Mock).mockResolvedValue(mockPrismaCreateResult);

            const candidate = new Candidate(candidateDataWithRelations);
            const savedCandidate = await candidate.save();

            // Verificaciones
            expect(prismaMock.candidate.create).toHaveBeenCalledTimes(1);
            expect(prismaMock.candidate.create).toHaveBeenCalledWith({
                data: {
                    firstName: 'Test',
                    lastName: 'Relations',
                    email: 'test.relations@example.com',
                    educations: {
                        create: [
                            {
                                institution: 'Uni',
                                title: 'Degree',
                                startDate: '2020-01-01',
                                endDate: '2024-12-31',
                            },
                        ],
                    },
                    workExperiences: {
                        create: [
                            {
                                company: 'Comp',
                                position: 'Dev',
                                description: 'Desc',
                                startDate: '2019-01-01',
                                endDate: '2023-12-31',
                            },
                        ],
                    },
                    resumes: {
                        create: [
                            {
                                filePath: 'path/to/resume.pdf',
                                fileType: 'application/pdf',
                            },
                        ],
                    },
                },
            });
            expect(savedCandidate).toEqual(mockPrismaCreateResult);
        });

        it('debería actualizar un candidato existente con datos básicos y devolver el candidato actualizado', async () => {
            const existingCandidateData = {
                id: 123,
                firstName: 'Existing',
                lastName: 'User',
                email: 'existing.user@example.com',
                phone: '111222333',
                address: 'Old Address',
            };

            const updatedData = {
                phone: '999888777',
                address: 'New Address',
            };

            const mockPrismaUpdateResult = { ...existingCandidateData, ...updatedData };
            (prismaMock.candidate.update as jest.Mock).mockResolvedValue(mockPrismaUpdateResult);

            const candidate = new Candidate(existingCandidateData);
            candidate.phone = updatedData.phone;
            candidate.address = updatedData.address;

            const savedCandidate = await candidate.save();

            // Verificaciones
            expect(prismaMock.candidate.update).toHaveBeenCalledTimes(1);
            expect(prismaMock.candidate.update).toHaveBeenCalledWith({
                where: { id: existingCandidateData.id },
                data: expect.objectContaining({
                    firstName: existingCandidateData.firstName,
                    lastName: existingCandidateData.lastName,
                    email: existingCandidateData.email,
                    phone: updatedData.phone,
                    address: updatedData.address,
                }),
            });
            expect(savedCandidate).toEqual(mockPrismaUpdateResult);
        });

        it('debería lanzar un error de conexión a la base de datos al actualizar', async () => {
            const existingCandidateData = {
                id: 123,
                firstName: 'Fail',
                lastName: 'User',
                email: 'fail@example.com'
            };
            const connectionErrorMessage = 'No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.';
            
            // Mockear que prisma.candidate.update lanza un PrismaClientInitializationError
            (prismaMock.candidate.update as jest.Mock).mockRejectedValue(new MockPrismaClientInitializationError());

            const candidate = new Candidate(existingCandidateData);

            await expect(candidate.save()).rejects.toThrow(connectionErrorMessage);
            expect(prismaMock.candidate.update).toHaveBeenCalledTimes(1);
            expect(prismaMock.candidate.update).toHaveBeenCalledWith({
                where: { id: existingCandidateData.id },
                data: expect.any(Object),
            });
        });

        it('debería lanzar un error de conexión a la base de datos al crear', async () => {
            const candidateData = {
                firstName: 'Error',
                lastName: 'Creation',
                email: 'error.creation@example.com',
            };
            const connectionErrorMessage = 'No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.';

            // Mockear que prisma.candidate.create lanza un PrismaClientInitializationError
            (prismaMock.candidate.create as jest.Mock).mockRejectedValue(new MockPrismaClientInitializationError());

            const candidate = new Candidate(candidateData);

            await expect(candidate.save()).rejects.toThrow(connectionErrorMessage);
            expect(prismaMock.candidate.create).toHaveBeenCalledTimes(1);
            expect(prismaMock.candidate.create).toHaveBeenCalledWith({
                data: expect.any(Object),
            });
        });

        it('debería relanzar otros errores genéricos de la base de datos al crear', async () => {
            const candidateData = {
                firstName: 'Generic',
                lastName: 'Error',
                email: 'generic.error.creation@example.com',
            };
            const genericError = new Error('Generic Prisma error during creation');

            // Mockear que prisma.candidate.create lanza un error genérico
            (prismaMock.candidate.create as jest.Mock).mockRejectedValue(genericError);

            const candidate = new Candidate(candidateData);

            await expect(candidate.save()).rejects.toThrow(genericError);
            expect(prismaMock.candidate.create).toHaveBeenCalledTimes(1);
            expect(prismaMock.candidate.create).toHaveBeenCalledWith({
                data: expect.any(Object),
            });
        });

        it('debería lanzar un error de registro no encontrado (P2025) al actualizar', async () => {
            const existingCandidateData = {
                id: 999,
                firstName: 'Non',
                lastName: 'Existent',
                email: 'non.existent@example.com'
            };
            const notFoundErrorMessage = 'No se pudo encontrar el registro del candidato con el ID proporcionado.';
            
            // Mockear que prisma.candidate.update lanza un error P2025
            (prismaMock.candidate.update as jest.Mock).mockRejectedValue(new MockPrismaClientKnownRequestError('P2025'));

            const candidate = new Candidate(existingCandidateData);

            await expect(candidate.save()).rejects.toThrow(notFoundErrorMessage);
            expect(prismaMock.candidate.update).toHaveBeenCalledTimes(1);
            expect(prismaMock.candidate.update).toHaveBeenCalledWith({
                where: { id: existingCandidateData.id },
                data: expect.any(Object),
            });
        });

        it('debería relanzar otros errores genéricos de la base de datos al actualizar', async () => {
            const existingCandidateData = {
                id: 999,
                firstName: 'Generic',
                lastName: 'Update',
                email: 'generic.update@example.com'
            };
            const genericErrorMessage = 'Generic Prisma error during update';
            const genericError = new Error(genericErrorMessage);

            // Mockear que prisma.candidate.update lanza un error genérico
            (prismaMock.candidate.update as jest.Mock).mockRejectedValue(genericError);

            const candidate = new Candidate(existingCandidateData);

            await expect(candidate.save()).rejects.toThrow(genericErrorMessage);
            expect(prismaMock.candidate.update).toHaveBeenCalledTimes(1);
            expect(prismaMock.candidate.update).toHaveBeenCalledWith({
                where: { id: existingCandidateData.id },
                data: expect.any(Object),
            });
        });
    });

    // Aquí podrían ir tests para otros métodos de la clase Candidate
}); 