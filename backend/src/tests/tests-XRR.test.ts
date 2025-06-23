// Mock de los modelos antes de cualquier importación (para tests del Service)
jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');

import { addCandidate } from '../application/services/candidateService';
import { addCandidateController } from '../presentation/controllers/candidateController';
import { mockCandidateData, mockPrismaResponses, mockPrismaErrors, createMockRequest, createMockResponse } from './test-helpers';

import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';

// ===================================================
// Tests del Service Layer
// ===================================================

describe('CandidateService', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addCandidate - Validación exitosa', () => {
    
    it('CA-001: Debe crear un candidato con datos mínimos requeridos', async () => {
      // Criterio de aceptación: Un candidato con firstName, lastName y email válidos debe ser creado exitosamente
      // Arrange
      const candidateData = mockCandidateData.valid;
      const mockSavedCandidate = mockPrismaResponses.candidateCreated;
      
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockSavedCandidate),
        education: [],
        workExperience: [],
        resumes: [],
      } as any));

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(Candidate).toHaveBeenCalledWith(candidateData);
      expect(result).toEqual(mockSavedCandidate);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('firstName', candidateData.firstName);
      expect(result).toHaveProperty('lastName', candidateData.lastName);
      expect(result).toHaveProperty('email', candidateData.email);
    });

    it('CA-002: Debe crear un candidato con todos los campos opcionales', async () => {
      // Criterio de aceptación: Un candidato con datos completos incluyendo educación, experiencia y CV debe ser creado exitosamente
      // Arrange
      const candidateData = mockCandidateData.validComplete;
      const mockSavedCandidate = mockPrismaResponses.candidateCreatedComplete;
      
      const mockCandidate = {
        save: jest.fn().mockResolvedValue(mockSavedCandidate),
        education: [],
        workExperience: [],
        resumes: [],
      };
      
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidate as any);
      
      const mockEducation = { 
        save: jest.fn().mockResolvedValue(mockPrismaResponses.educationCreated),
        candidateId: undefined,
      };
      const mockWorkExperience = { 
        save: jest.fn().mockResolvedValue(mockPrismaResponses.workExperienceCreated),
        candidateId: undefined,
      };
      const mockResume = { 
        save: jest.fn().mockResolvedValue(mockPrismaResponses.resumeCreated),
        candidateId: undefined,
      };
      
      (Education as jest.MockedClass<typeof Education>).mockImplementation(() => mockEducation as any);
      (WorkExperience as jest.MockedClass<typeof WorkExperience>).mockImplementation(() => mockWorkExperience as any);
      (Resume as jest.MockedClass<typeof Resume>).mockImplementation(() => mockResume as any);

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(Candidate).toHaveBeenCalledWith(candidateData);
      expect(Education).toHaveBeenCalledWith(candidateData.educations[0]);
      expect(WorkExperience).toHaveBeenCalledWith(candidateData.workExperiences[0]);
      expect(Resume).toHaveBeenCalledWith(candidateData.cv);
      expect(result).toEqual(mockSavedCandidate);
      expect(mockEducation.save).toHaveBeenCalled();
      expect(mockWorkExperience.save).toHaveBeenCalled();
      expect(mockResume.save).toHaveBeenCalled();
      expect(mockEducation.candidateId).toBe(mockSavedCandidate.id);
      expect(mockWorkExperience.candidateId).toBe(mockSavedCandidate.id);
      expect(mockResume.candidateId).toBe(mockSavedCandidate.id);
    });

    it('CA-003: Debe crear un candidato con múltiples educaciones y experiencias', async () => {
      // Criterio de aceptación: Un candidato puede tener múltiples registros de educación y experiencia laboral
      // Arrange
      const candidateData = mockCandidateData.validMultiple;
      const mockSavedCandidate = { ...mockPrismaResponses.candidateCreated, id: 3 };
      
      const mockCandidate = {
        save: jest.fn().mockResolvedValue(mockSavedCandidate),
        education: [],
        workExperience: [],
        resumes: [],
      };
      
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidate as any);
      
      const mockEducation = { 
        save: jest.fn().mockResolvedValue(mockPrismaResponses.educationCreated),
        candidateId: undefined,
      };
      const mockWorkExperience = { 
        save: jest.fn().mockResolvedValue(mockPrismaResponses.workExperienceCreated),
        candidateId: undefined,
      };
      
      (Education as jest.MockedClass<typeof Education>).mockImplementation(() => mockEducation as any);
      (WorkExperience as jest.MockedClass<typeof WorkExperience>).mockImplementation(() => mockWorkExperience as any);

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(Education).toHaveBeenCalledTimes(2); // Dos educaciones
      expect(WorkExperience).toHaveBeenCalledTimes(2); // Dos experiencias
      expect(mockEducation.save).toHaveBeenCalledTimes(2);
      expect(mockWorkExperience.save).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockSavedCandidate);
    });

    it('CA-004: Debe crear un candidato solo con CV sin educaciones ni experiencias', async () => {
      // Criterio de aceptación: Un candidato puede tener CV sin educación ni experiencia laboral registrada
      // Arrange
      const candidateData = {
        ...mockCandidateData.valid,
        cv: mockCandidateData.validComplete.cv,
      };
      const mockSavedCandidate = mockPrismaResponses.candidateCreated;
      
      const mockCandidate = {
        save: jest.fn().mockResolvedValue(mockSavedCandidate),
        education: [],
        workExperience: [],
        resumes: [],
      };
      
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidate as any);
      
      const mockResume = { 
        save: jest.fn().mockResolvedValue(mockPrismaResponses.resumeCreated),
        candidateId: undefined,
      };
      (Resume as jest.MockedClass<typeof Resume>).mockImplementation(() => mockResume as any);

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(Resume).toHaveBeenCalledWith(candidateData.cv);
      expect(mockResume.save).toHaveBeenCalled();
      expect(Education).not.toHaveBeenCalled();
      expect(WorkExperience).not.toHaveBeenCalled();
      expect(result).toEqual(mockSavedCandidate);
    });
  });

  describe('addCandidate - Validación fallida', () => {

    it('CV-001: Debe rechazar candidato sin firstName', async () => {
      // Criterio de aceptación: firstName es un campo obligatorio
      // Arrange
      const candidateData = mockCandidateData.invalid.firstNameMissing;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid name');
    });

    it('CV-002: Debe rechazar candidato con firstName muy corto', async () => {
      // Criterio de aceptación: firstName debe tener al menos 2 caracteres
      // Arrange
      const candidateData = mockCandidateData.invalid.firstNameTooShort;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid name');
    });

    it('CV-003: Debe rechazar candidato con firstName muy largo', async () => {
      // Criterio de aceptación: firstName no puede exceder 100 caracteres
      // Arrange
      const candidateData = mockCandidateData.invalid.firstNameTooLong;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid name');
    });

    it('CV-004: Debe rechazar candidato con firstName con caracteres inválidos', async () => {
      // Criterio de aceptación: firstName solo puede contener letras, espacios y caracteres acentuados
      // Arrange
      const candidateData = mockCandidateData.invalid.firstNameInvalidChars;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid name');
    });

    it('CV-005: Debe rechazar candidato sin lastName', async () => {
      // Criterio de aceptación: lastName es un campo obligatorio
      // Arrange
      const candidateData = mockCandidateData.invalid.lastNameMissing;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid name');
    });

    it('CV-006: Debe rechazar candidato con lastName muy corto', async () => {
      // Criterio de aceptación: lastName debe tener al menos 2 caracteres
      // Arrange
      const candidateData = mockCandidateData.invalid.lastNameTooShort;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid name');
    });

    it('CV-007: Debe rechazar candidato con lastName muy largo', async () => {
      // Criterio de aceptación: lastName no puede exceder 100 caracteres
      // Arrange
      const candidateData = mockCandidateData.invalid.lastNameTooLong;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid name');
    });

    it('CV-008: Debe rechazar candidato sin email', async () => {
      // Criterio de aceptación: email es un campo obligatorio
      // Arrange
      const candidateData = mockCandidateData.invalid.emailMissing;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid email');
    });

    it('CV-009: Debe rechazar candidato con email en formato inválido', async () => {
      // Criterio de aceptación: email debe tener un formato válido (usuario@dominio.extension)
      // Arrange
      const candidateData = mockCandidateData.invalid.emailInvalidFormat;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid email');
    });

    it('CV-010: Debe rechazar candidato con email incompleto', async () => {
      // Criterio de aceptación: email debe tener dominio y extensión válidos
      // Arrange
      const candidateData = mockCandidateData.invalid.emailInvalidFormat2;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid email');
    });

    it('CV-011: Debe rechazar candidato con teléfono en formato inválido', async () => {
      // Criterio de aceptación: teléfono español debe empezar por 6, 7 o 9 y tener 9 dígitos
      // Arrange
      const candidateData = mockCandidateData.invalid.phoneInvalidFormat;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid phone');
    });

    it('CV-012: Debe rechazar candidato con teléfono de longitud inválida', async () => {
      // Criterio de aceptación: teléfono debe tener exactamente 9 dígitos
      // Arrange
      const candidateData = mockCandidateData.invalid.phoneInvalidLength;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid phone');
    });

    it('CV-013: Debe rechazar candidato con dirección muy larga', async () => {
      // Criterio de aceptación: dirección no puede exceder 100 caracteres
      // Arrange
      const candidateData = mockCandidateData.invalid.addressTooLong;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid address');
    });

    it('CV-014: Debe rechazar candidato con educación inválida', async () => {
      // Criterio de aceptación: educación debe tener institución, título y fechas válidas
      // Arrange
      const candidateData = mockCandidateData.invalid.invalidEducation;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid institution');
    });

    it('CV-015: Debe rechazar candidato con experiencia laboral inválida', async () => {
      // Criterio de aceptación: experiencia laboral debe tener empresa, puesto y fechas válidas
      // Arrange
      const candidateData = mockCandidateData.invalid.invalidWorkExperience;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid company');
    });

    it('CV-016: Debe rechazar candidato con CV inválido', async () => {
      // Criterio de aceptación: CV debe tener filePath y fileType válidos
      // Arrange
      const candidateData = mockCandidateData.invalid.invalidCV;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid CV data');
    });
  });

  describe('addCandidate - Persistencia en base de datos', () => {

    it('CP-001: Debe guardar candidato exitosamente en base de datos', async () => {
      // Criterio de aceptación: Los datos válidos del candidato deben ser persistidos correctamente
      // Arrange
      const candidateData = mockCandidateData.valid;
      const mockSavedCandidate = mockPrismaResponses.candidateCreated;
      
      const mockSave = jest.fn().mockResolvedValue(mockSavedCandidate);
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
        save: mockSave,
        education: [],
        workExperience: [],
        resumes: [],
      } as any));

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockSavedCandidate);
      expect(result.id).toBeDefined();
    });

    it('CP-002: Debe manejar error de email duplicado (P2002)', async () => {
      // Criterio de aceptación: El sistema debe rechazar candidatos con email ya existente
      // Arrange
      const candidateData = mockCandidateData.valid;
      const duplicateError = { ...mockPrismaErrors.duplicateEmail };
      
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(duplicateError),
        education: [],
        workExperience: [],
        resumes: [],
      } as any));

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
    });

    it('CP-003: Debe manejar error de conexión a base de datos', async () => {
      // Criterio de aceptación: El sistema debe manejar errores de conectividad de base de datos
      // Arrange
      const candidateData = mockCandidateData.valid;
      const connectionError = new Error('Database connection failed');
      
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(connectionError),
        education: [],
        workExperience: [],
        resumes: [],
      } as any));

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Database connection failed');
    });
  });

  describe('addCandidate - Casos límite', () => {

    it('CL-001: Debe aceptar nombres en el límite máximo de caracteres (100)', async () => {
      // Criterio de aceptación: Nombres de exactamente 100 caracteres deben ser aceptados
      // Arrange
      const candidateData = {
        firstName: 'A'.repeat(100),
        lastName: 'B'.repeat(100),
        email: 'test@example.com',
      };
      const mockSavedCandidate = mockPrismaResponses.candidateCreated;
      
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockSavedCandidate),
        education: [],
        workExperience: [],
        resumes: [],
      } as any));

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(result).toEqual(mockSavedCandidate);
    });

    it('CL-002: Debe aceptar direcciones en el límite máximo de caracteres (100)', async () => {
      // Criterio de aceptación: Direcciones de exactamente 100 caracteres deben ser aceptadas
      // Arrange
      const candidateData = {
        ...mockCandidateData.valid,
        address: 'A'.repeat(100),
      };
      const mockSavedCandidate = mockPrismaResponses.candidateCreated;
      
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockSavedCandidate),
        education: [],
        workExperience: [],
        resumes: [],
      } as any));

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(result).toEqual(mockSavedCandidate);
    });

    it('CL-003: Debe aceptar teléfonos válidos con diferentes prefijos españoles', async () => {
      // Criterio de aceptación: Teléfonos con prefijos 6, 7 y 9 deben ser aceptados
      // Arrange
      const testCases = ['612345678', '723456789', '987654321'];
      
      for (const phone of testCases) {
        const candidateData = {
          ...mockCandidateData.valid,
          phone,
        };
        const mockSavedCandidate = mockPrismaResponses.candidateCreated;
        
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
          save: jest.fn().mockResolvedValue(mockSavedCandidate),
          education: [],
          workExperience: [],
          resumes: [],
        } as any));

        // Act
        const result = await addCandidate(candidateData);

        // Assert
        expect(result).toEqual(mockSavedCandidate);
      }
    });

    it('CL-004: Debe manejar arrays vacíos para educations y workExperiences', async () => {
      // Criterio de aceptación: Arrays vacíos de educación y experiencia deben ser manejados correctamente
      // Arrange
      const candidateData = {
        ...mockCandidateData.valid,
        educations: [],
        workExperiences: [],
      };
      const mockSavedCandidate = mockPrismaResponses.candidateCreated;
      
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockSavedCandidate),
        education: [],
        workExperience: [],
        resumes: [],
      } as any));

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(Education).not.toHaveBeenCalled();
      expect(WorkExperience).not.toHaveBeenCalled();
      expect(result).toEqual(mockSavedCandidate);
    });

    it('CL-005: Debe manejar CV con objeto vacío correctamente', async () => {
      // Criterio de aceptación: CV como objeto vacío no debe crear registro de resume
      // Arrange
      const candidateData = {
        ...mockCandidateData.valid,
        cv: {},
      };
      const mockSavedCandidate = mockPrismaResponses.candidateCreated;
      
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockSavedCandidate),
        education: [],
        workExperience: [],
        resumes: [],
      } as any));

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(Resume).not.toHaveBeenCalled();
      expect(result).toEqual(mockSavedCandidate);
    });

    it('CL-006: Debe aceptar caracteres especiales válidos en nombres (ñ, acentos)', async () => {
      // Criterio de aceptación: Nombres con caracteres del idioma español deben ser aceptados
      // Arrange
      const candidateData = {
        firstName: 'José María',
        lastName: 'Muñoz Pérez',
        email: 'jose.munoz@example.com',
      };
      const mockSavedCandidate = mockPrismaResponses.candidateCreated;
      
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockSavedCandidate),
        education: [],
        workExperience: [],
        resumes: [],
      } as any));

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(result).toEqual(mockSavedCandidate);
    });
  });
});

// ===================================================
// Tests del Controller Layer
// ===================================================

describe('CandidateController', () => {
  
  // Crear un mock manual del service para los tests del controller
  const mockAddCandidate = jest.fn();
  
  beforeAll(() => {
    // Mockear solo el service para los tests del controller
    jest.doMock('../application/services/candidateService', () => ({
      addCandidate: mockAddCandidate,
    }));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockAddCandidate.mockClear();
  });

  describe('addCandidateController - Respuestas exitosas', () => {

    it('CC-001: Debe responder con status 201 y candidato creado correctamente', async () => {
      // Criterio de aceptación: Controller debe retornar 201 con mensaje y datos del candidato creado
      // Arrange
      const candidateData = mockCandidateData.valid;
      const mockSavedCandidate = mockPrismaResponses.candidateCreated;
      const req = createMockRequest(candidateData);
      const res = createMockResponse();

      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(req as any, res as any);

      // Assert
      expect(mockAddCandidate).toHaveBeenCalledWith(candidateData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: mockSavedCandidate
      });
    });

    it('CC-002: Debe llamar al service con los datos del request body', async () => {
      // Criterio de aceptación: Controller debe pasar correctamente los datos del body al service
      // Arrange
      const candidateData = mockCandidateData.validComplete;
      const mockSavedCandidate = mockPrismaResponses.candidateCreatedComplete;
      const req = createMockRequest(candidateData);
      const res = createMockResponse();

      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(req as any, res as any);

      // Assert
      expect(mockAddCandidate).toHaveBeenCalledWith(candidateData);
      expect(mockAddCandidate).toHaveBeenCalledTimes(1);
    });

    it('CC-003: Debe retornar el formato de respuesta correcto', async () => {
      // Criterio de aceptación: La respuesta debe contener message y data con la estructura esperada
      // Arrange
      const candidateData = mockCandidateData.valid;
      const mockSavedCandidate = mockPrismaResponses.candidateCreated;
      const req = createMockRequest(candidateData);
      const res = createMockResponse();

      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(req as any, res as any);

      // Assert
      const responseCall = res.json.mock.calls[0][0];
      expect(responseCall).toHaveProperty('message');
      expect(responseCall).toHaveProperty('data');
      expect(responseCall.message).toBe('Candidate added successfully');
      expect(responseCall.data).toEqual(mockSavedCandidate);
    });
  });

  describe('addCandidateController - Manejo de errores', () => {

    it('CCE-001: Debe responder con status 400 para errores de validación', async () => {
      // Criterio de aceptación: Errores de validación deben retornar 400 con mensaje de error
      // Arrange
      const candidateData = mockCandidateData.invalid.firstNameMissing;
      const req = createMockRequest(candidateData);
      const res = createMockResponse();
      const validationError = new Error('Invalid name');

      mockAddCandidate.mockRejectedValue(validationError);

      // Act
      await addCandidateController(req as any, res as any);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Invalid name'
      });
    });

    it('CCE-002: Debe responder con status 400 para error de email duplicado', async () => {
      // Criterio de aceptación: Error de email duplicado debe retornar 400 con mensaje específico
      // Arrange
      const candidateData = mockCandidateData.valid;
      const req = createMockRequest(candidateData);
      const res = createMockResponse();
      const duplicateError = new Error('The email already exists in the database');

      mockAddCandidate.mockRejectedValue(duplicateError);

      // Act
      await addCandidateController(req as any, res as any);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'The email already exists in the database'
      });
    });

    it('CCE-003: Debe responder con status 400 para errores de conexión de base de datos', async () => {
      // Criterio de aceptación: Errores de base de datos deben retornar 400 con mensaje de error
      // Arrange
      const candidateData = mockCandidateData.valid;
      const req = createMockRequest(candidateData);
      const res = createMockResponse();
      const dbError = new Error('Database connection failed');

      mockAddCandidate.mockRejectedValue(dbError);

      // Act
      await addCandidateController(req as any, res as any);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Database connection failed'
      });
    });

    it('CCE-004: Debe manejar errores unknown correctamente', async () => {
      // Criterio de aceptación: Errores no identificados deben ser manejados sin fallar la aplicación
      // Arrange
      const candidateData = mockCandidateData.valid;
      const req = createMockRequest(candidateData);
      const res = createMockResponse();
      const unknownError = { someProperty: 'unknown error' }; // No es instancia de Error

      mockAddCandidate.mockRejectedValue(unknownError);

      // Act
      await addCandidateController(req as any, res as any);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Unknown error'
      });
    });

    it('CCE-005: Debe preservar el mensaje de error original del service', async () => {
      // Criterio de aceptación: Los mensajes de error específicos del service deben ser preservados
      // Arrange
      const candidateData = mockCandidateData.invalid.emailInvalidFormat;
      const req = createMockRequest(candidateData);
      const res = createMockResponse();
      const specificError = new Error('Invalid email format: missing domain');

      mockAddCandidate.mockRejectedValue(specificError);

      // Act
      await addCandidateController(req as any, res as any);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Invalid email format: missing domain'
      });
    });

    it('CCE-006: Debe manejar múltiples errores de validación', async () => {
      // Criterio de aceptación: Controller debe manejar cualquier tipo de error de validación del service
      // Arrange
      const testCases = [
        { data: mockCandidateData.invalid.firstNameTooShort, expectedError: 'Invalid name' },
        { data: mockCandidateData.invalid.emailMissing, expectedError: 'Invalid email' },
        { data: mockCandidateData.invalid.phoneInvalidFormat, expectedError: 'Invalid phone' },
        { data: mockCandidateData.invalid.addressTooLong, expectedError: 'Invalid address' }
      ];

      for (const testCase of testCases) {
        const req = createMockRequest(testCase.data);
        const res = createMockResponse();
        const error = new Error(testCase.expectedError);

        mockAddCandidate.mockRejectedValue(error);

        // Act
        await addCandidateController(req as any, res as any);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Error adding candidate',
          error: testCase.expectedError
        });

        // Clear mocks para el siguiente test
        jest.clearAllMocks();
        mockAddCandidate.mockClear();
      }
    });
  });

  describe('addCandidateController - Integración con service', () => {

    it('CCI-001: Debe integrar correctamente con candidateService para datos válidos', async () => {
      // Criterio de aceptación: Controller e service deben trabajar juntos correctamente
      // Arrange
      const candidateData = mockCandidateData.validComplete;
      const mockSavedCandidate = mockPrismaResponses.candidateCreatedComplete;
      const req = createMockRequest(candidateData);
      const res = createMockResponse();

      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(req as any, res as any);

      // Assert
      // Verificar que se llama al service
      expect(mockAddCandidate).toHaveBeenCalledWith(candidateData);
      
      // Verificar que la respuesta es correcta
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: mockSavedCandidate
      });
      
      // Verificar que no se llama a ningún método de error
      expect(res.status).not.toHaveBeenCalledWith(400);
    });

    it('CCI-002: Debe integrar correctamente con candidateService para errores', async () => {
      // Criterio de aceptación: Controller debe manejar correctamente errores del service
      // Arrange
      const candidateData = mockCandidateData.invalid.invalidEducation;
      const req = createMockRequest(candidateData);
      const res = createMockResponse();
      const serviceError = new Error('Invalid institution');

      mockAddCandidate.mockRejectedValue(serviceError);

      // Act
      await addCandidateController(req as any, res as any);

      // Assert
      // Verificar que se llama al service
      expect(mockAddCandidate).toHaveBeenCalledWith(candidateData);
      
      // Verificar que la respuesta de error es correcta
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Invalid institution'
      });
      
      // Verificar que no se llama al método de éxito
      expect(res.status).not.toHaveBeenCalledWith(201);
    });

    it('CCI-003: Debe pasar los datos del request sin modificación al service', async () => {
      // Criterio de aceptación: Los datos del request body deben llegar intactos al service
      // Arrange
      const originalData = {
        ...mockCandidateData.validComplete,
        customField: 'test-value', // Campo adicional para verificar que se pasa tal como está
        nested: {
          property: 'nested-value'
        }
      };
      const req = createMockRequest(originalData);
      const res = createMockResponse();
      const mockSavedCandidate = mockPrismaResponses.candidateCreatedComplete;

      mockAddCandidate.mockResolvedValue(mockSavedCandidate);

      // Act
      await addCandidateController(req as any, res as any);

      // Assert
      expect(mockAddCandidate).toHaveBeenCalledWith(originalData);
      expect(mockAddCandidate).toHaveBeenCalledTimes(1);
    });
  });
}); 