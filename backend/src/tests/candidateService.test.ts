import { addCandidate } from '../application/services/candidateService';
import { validateCandidateData } from '../application/validator';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';

// Mock de las dependencias
jest.mock('../application/validator');
jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');

describe('addCandidate', () => {
    let mockCandidateInstance: any;
    let mockEducationInstance: any;
    let mockWorkExperienceInstance: any;
    let mockResumeInstance: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock de la implementación del constructor de Candidate
        mockCandidateInstance = {
            id: 'candidate-123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '123456789',
            address: '123 Main St',
            education: [],
            workExperience: [],
            resumes: [],
            save: jest.fn(), // Mock del método save de la instancia
        };
        (Candidate as unknown as jest.Mock).mockImplementation(() => mockCandidateInstance);

        // Mock de las implementaciones de save y del constructor para los otros modelos
        mockEducationInstance = { save: jest.fn(), candidateId: undefined };
        (Education as unknown as jest.Mock).mockImplementation(() => mockEducationInstance);
        mockEducationInstance.save.mockResolvedValue({ id: 'edu-456' });

        mockWorkExperienceInstance = { save: jest.fn(), candidateId: undefined };
        (WorkExperience as unknown as jest.Mock).mockImplementation(() => mockWorkExperienceInstance);
        mockWorkExperienceInstance.save.mockResolvedValue({ id: 'work-789' });

        mockResumeInstance = { save: jest.fn(), candidateId: undefined };
        (Resume as unknown as jest.Mock).mockImplementation(() => mockResumeInstance);
        mockResumeInstance.save.mockResolvedValue({ id: 'resume-012' });
    });

    it('debería guardar un candidato con todos los datos válidos y devolver el candidato guardado', async () => {
        const mockCandidateData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '123456789',
            address: '123 Main St',
            educations: [
                { institution: 'University', title: 'Degree', startDate: '2010-01-01', endDate: '2014-12-31' }
            ],
            workExperiences: [
                { company: 'Tech Corp', position: 'Dev', description: '...', startDate: '2015-01-01', endDate: '2020-12-31' }
            ],
            cv: { filePath: 'path/to/cv.pdf', fileType: 'application/pdf' }
        };

        const mockSavedCandidateReturnValue = { id: 'candidate-123', ...mockCandidateData, education: [], workExperience: [], resumes: [] };

        // Asegurar que el método save de la instancia mockeada se resuelva con el valor esperado
        mockCandidateInstance.save.mockResolvedValue(mockSavedCandidateReturnValue);

        const result = await addCandidate(mockCandidateData);

        // Verificaciones
        expect(validateCandidateData).toHaveBeenCalledTimes(1);
        expect(validateCandidateData).toHaveBeenCalledWith(mockCandidateData);

        expect(Candidate).toHaveBeenCalledTimes(1);
        expect(Candidate).toHaveBeenCalledWith(mockCandidateData);
        expect(mockCandidateInstance.save).toHaveBeenCalledTimes(1);

        // Comprobar si los elementos se añadieron a los arrays de la instancia mockeada
        expect(mockCandidateInstance.education.length).toBe(1);
        expect(mockCandidateInstance.workExperience.length).toBe(1);
        expect(mockCandidateInstance.resumes.length).toBe(1);

        expect(Education).toHaveBeenCalledTimes(1);
        expect(Education).toHaveBeenCalledWith(mockCandidateData.educations[0]);
        expect(mockEducationInstance.save).toHaveBeenCalledTimes(1);
        expect(mockEducationInstance.candidateId).toBe(mockCandidateInstance.id);

        expect(WorkExperience).toHaveBeenCalledTimes(1);
        expect(WorkExperience).toHaveBeenCalledWith(mockCandidateData.workExperiences[0]);
        expect(mockWorkExperienceInstance.save).toHaveBeenCalledTimes(1);
        expect(mockWorkExperienceInstance.candidateId).toBe(mockCandidateInstance.id);

        expect(Resume).toHaveBeenCalledTimes(1);
        expect(Resume).toHaveBeenCalledWith(mockCandidateData.cv);
        expect(mockResumeInstance.save).toHaveBeenCalledTimes(1);
        expect(mockResumeInstance.candidateId).toBe(mockCandidateInstance.id);
        
        expect(result).toEqual(expect.objectContaining({
            id: mockSavedCandidateReturnValue.id,
            firstName: mockCandidateData.firstName,
            lastName: mockCandidateData.lastName,
            email: mockCandidateData.email,
            phone: mockCandidateData.phone,
            address: mockCandidateData.address,
        }));
    });

    it('debería guardar un candidato solo con la información básica y devolver el candidato guardado', async () => {
        const mockCandidateData = {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            phone: '987654321',
            address: '456 Oak Ave',
        };

        const mockSavedCandidateReturnValue = { id: 'candidate-456', ...mockCandidateData, education: [], workExperience: [], resumes: [] };

        mockCandidateInstance.save.mockResolvedValue(mockSavedCandidateReturnValue);

        const result = await addCandidate(mockCandidateData);

        // Verificaciones
        expect(validateCandidateData).toHaveBeenCalledTimes(1);
        expect(validateCandidateData).toHaveBeenCalledWith(mockCandidateData);

        expect(Candidate).toHaveBeenCalledTimes(1);
        expect(Candidate).toHaveBeenCalledWith(mockCandidateData);
        expect(mockCandidateInstance.save).toHaveBeenCalledTimes(1);

        // Asegurarse de que no se llamen los mocks de educación, experiencia laboral y CV
        expect(Education).not.toHaveBeenCalled();
        expect(Education.prototype.save).not.toHaveBeenCalled();
        expect(mockCandidateInstance.education.length).toBe(0);

        expect(WorkExperience).not.toHaveBeenCalled();
        expect(WorkExperience.prototype.save).not.toHaveBeenCalled();
        expect(mockCandidateInstance.workExperience.length).toBe(0);

        expect(Resume).not.toHaveBeenCalled();
        expect(Resume.prototype.save).not.toHaveBeenCalled();
        expect(mockCandidateInstance.resumes.length).toBe(0);
        
        expect(result).toEqual(expect.objectContaining({
            id: mockSavedCandidateReturnValue.id,
            firstName: mockCandidateData.firstName,
            lastName: mockCandidateData.lastName,
            email: mockCandidateData.email,
            phone: mockCandidateData.phone,
            address: mockCandidateData.address,
        }));
    });

    it('debería lanzar un error si los datos del candidato son inválidos', async () => {
        const mockInvalidCandidateData = {
            firstName: 'Invalid',
            lastName: 'Candidate',
            email: 'invalid-email', // Correo electrónico inválido
            // Faltan campos requeridos
        };

        const validationErrorMessage = 'Invalid candidate data';
        (validateCandidateData as jest.Mock).mockImplementationOnce(() => {
            throw new Error(validationErrorMessage);
        });

        // Verificar que addCandidate lanza el error esperado
        await expect(addCandidate(mockInvalidCandidateData)).rejects.toThrow(validationErrorMessage);

        // Verificaciones de llamadas
        expect(validateCandidateData).toHaveBeenCalledTimes(1);
        expect(validateCandidateData).toHaveBeenCalledWith(mockInvalidCandidateData);

        // Asegurarse de que ninguna operación de guardado en la base de datos sea llamada
        expect(Candidate).not.toHaveBeenCalled();
        expect(mockCandidateInstance.save).not.toHaveBeenCalled();
        expect(Education).not.toHaveBeenCalled();
        expect(Education.prototype.save).not.toHaveBeenCalled();
        expect(WorkExperience).not.toHaveBeenCalled();
        expect(WorkExperience.prototype.save).not.toHaveBeenCalled();
        expect(Resume).not.toHaveBeenCalled();
        expect(Resume.prototype.save).not.toHaveBeenCalled();
    });

    it('debería lanzar un error si el correo electrónico del candidato ya existe (error P2002)', async () => {
        const mockCandidateData = {
            firstName: 'Existing',
            lastName: 'User',
            email: 'existing.user@example.com',
            phone: '111111111',
            address: '789 Pine St',
        };

        // Mockear que Candidate.prototype.save lanza un error P2002
        const prismaP2002Error: any = new Error('Unique constraint failed on the fields: (`email`)');
        prismaP2002Error.code = 'P2002';
        mockCandidateInstance.save.mockRejectedValue(prismaP2002Error);

        // Verificar que addCandidate lanza el error esperado
        await expect(addCandidate(mockCandidateData)).rejects.toThrow('The email already exists in the database');

        // Verificaciones de llamadas
        expect(validateCandidateData).toHaveBeenCalledTimes(1);
        expect(validateCandidateData).toHaveBeenCalledWith(mockCandidateData);

        expect(Candidate).toHaveBeenCalledTimes(1);
        expect(Candidate).toHaveBeenCalledWith(mockCandidateData);
        expect(mockCandidateInstance.save).toHaveBeenCalledTimes(1);

        // Asegurarse de que no se llamen los mocks de educación, experiencia laboral y CV
        expect(Education).not.toHaveBeenCalled();
        expect(Education.prototype.save).not.toHaveBeenCalled();
        expect(WorkExperience).not.toHaveBeenCalled();
        expect(WorkExperience.prototype.save).not.toHaveBeenCalled();
        expect(Resume).not.toHaveBeenCalled();
        expect(Resume.prototype.save).not.toHaveBeenCalled();
    });

    it('debería relanzar otros errores genéricos de la base de datos', async () => {
        const mockCandidateData = {
            firstName: 'Generic',
            lastName: 'Error',
            email: 'generic.error@example.com',
            phone: '222222222',
            address: '999 Generic St',
        };

        const genericErrorMessage = 'Database connection lost';
        const genericError = new Error(genericErrorMessage);
        
        // Mockear que Candidate.prototype.save lanza un error genérico
        mockCandidateInstance.save.mockRejectedValue(genericError);

        // Verificar que addCandidate relanza el error esperado
        await expect(addCandidate(mockCandidateData)).rejects.toThrow(genericErrorMessage);

        // Verificaciones de llamadas
        expect(validateCandidateData).toHaveBeenCalledTimes(1);
        expect(validateCandidateData).toHaveBeenCalledWith(mockCandidateData);

        expect(Candidate).toHaveBeenCalledTimes(1);
        expect(Candidate).toHaveBeenCalledWith(mockCandidateData);
        expect(mockCandidateInstance.save).toHaveBeenCalledTimes(1);

        // Asegurarse de que no se llamen los mocks de educación, experiencia laboral y CV
        expect(Education).not.toHaveBeenCalled();
        expect(Education.prototype.save).not.toHaveBeenCalled();
        expect(WorkExperience).not.toHaveBeenCalled();
        expect(WorkExperience.prototype.save).not.toHaveBeenCalled();
        expect(Resume).not.toHaveBeenCalled();
        expect(Resume.prototype.save).not.toHaveBeenCalled();
    });
}); 