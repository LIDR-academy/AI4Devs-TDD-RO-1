import { Request, Response } from 'express';
import { addCandidateController } from '../presentation/controllers/candidateController';
import * as candidateService from '../application/services/candidateService';

// Mock del servicio
jest.mock('../application/services/candidateService');
const mockAddCandidate = candidateService.addCandidate as jest.MockedFunction<typeof candidateService.addCandidate>;

// Datos de test realistas españoles
const validCandidate = {
  firstName: "María",
  lastName: "García López",
  email: "maria.garcia@gmail.com",
  phone: "612345678",
  address: "Calle Gran Vía 123, 4º A, Madrid",
  educations: [
    {
      institution: "Universidad Complutense de Madrid",
      title: "Grado en Ingeniería Informática",
      startDate: "2018-09-01",
      endDate: "2022-06-30"
    },
    {
      institution: "UC3M",
      title: "Máster en Desarrollo de Software",
      startDate: "2022-09-01",
      endDate: "2024-06-30"
    }
  ],
  workExperiences: [
    {
      company: "Telefónica",
      position: "Desarrolladora Junior",
      description: "Desarrollo de aplicaciones web con React y Node.js",
      startDate: "2022-07-01",
      endDate: "2023-12-31"
    },
    {
      company: "Banco Santander",
      position: "Software Engineer",
      description: "Backend development con Java y Spring Boot",
      startDate: "2024-01-15"
    }
  ],
  cv: {
    filePath: "uploads/1715760936750-cv-maria-garcia.pdf",
    fileType: "application/pdf"
  }
};

const invalidCandidate = {
  firstName: "",
  lastName: "García123",
  email: "email-invalido",
  phone: "123456",
  address: "Esta dirección es demasiado larga para el campo de la base de datos, excede los 100 caracteres permitidos por el schema de Prisma definido en el modelo",
  educations: [
    {
      institution: "",
      title: "Título demasiado largo que excede los 100 caracteres permitidos por el schema de la base de datos y debería fallar la validación",
      startDate: "fecha-invalida",
      endDate: "2025-13-45"
    }
  ],
  workExperiences: [
    {
      company: "",
      position: "Posición demasiado larga que excede los 100 caracteres permitidos por el schema definido en Prisma",
      description: "Descripción extremadamente larga que supera los 200 caracteres permitidos por el schema de la base de datos, esta descripción debe fallar la validación porque excede significativamente el límite establecido para este campo en particular",
      startDate: "2024-99-99",
      endDate: "invalid-date"
    }
  ],
  cv: {
    filePath: "",
    fileType: "invalid-type"
  }
};

const candidateWithOptionals = {
  firstName: "José",
  lastName: "López Martínez",
  email: "jose.lopez@uam.es"
};

// Helper para crear mocks de Express Request/Response
const createMockReq = (body: any): Partial<Request> => ({
  body
});

const createMockRes = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Tests ACV - Suite de Tests para Postulación desde la Web', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = createMockRes();
  });

  describe('CandidateController - Recepción de datos del formulario', () => {
    describe('Casos exitosos', () => {
      it('debe crear un candidato con datos válidos completos y retornar 201', async () => {
        // Arrange
        const expectedCandidate = { 
          id: 1, 
          firstName: validCandidate.firstName,
          lastName: validCandidate.lastName,
          email: validCandidate.email,
          phone: validCandidate.phone,
          address: validCandidate.address
        };
        mockAddCandidate.mockResolvedValue(expectedCandidate);
        mockReq = createMockReq(validCandidate);

        // Act
        await addCandidateController(mockReq as Request, mockRes as Response);

        // Assert
        expect(mockAddCandidate).toHaveBeenCalledWith(validCandidate);
        expect(mockAddCandidate).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Candidate added successfully',
          data: expectedCandidate
        });
      });

      it('debe crear un candidato con solo campos obligatorios y retornar 201', async () => {
        // Arrange
        const expectedCandidate = { 
          id: 2, 
          firstName: candidateWithOptionals.firstName,
          lastName: candidateWithOptionals.lastName,
          email: candidateWithOptionals.email,
          phone: null,
          address: null
        };
        mockAddCandidate.mockResolvedValue(expectedCandidate);
        mockReq = createMockReq(candidateWithOptionals);

        // Act
        await addCandidateController(mockReq as Request, mockRes as Response);

        // Assert
        expect(mockAddCandidate).toHaveBeenCalledWith(candidateWithOptionals);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Candidate added successfully',
          data: expectedCandidate
        });
      });

      it('debe manejar candidato sin campos opcionales (phone, address, educations, workExperiences, cv)', async () => {
        // Arrange
        const minimalCandidate = {
          firstName: "Ana",
          lastName: "Rodríguez Sánchez",
          email: "ana.rodriguez@uc3m.es"
        };
        const expectedCandidate = { 
          id: 3, 
          firstName: minimalCandidate.firstName,
          lastName: minimalCandidate.lastName,
          email: minimalCandidate.email,
          phone: null,
          address: null
        };
        mockAddCandidate.mockResolvedValue(expectedCandidate);
        mockReq = createMockReq(minimalCandidate);

        // Act
        await addCandidateController(mockReq as Request, mockRes as Response);

        // Assert
        expect(mockAddCandidate).toHaveBeenCalledWith(minimalCandidate);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Candidate added successfully',
          data: expectedCandidate
        });
      });
    });

    describe('Errores de validación', () => {
      it('debe retornar 400 cuando los datos de entrada son inválidos', async () => {
        // Arrange
        const validationError = new Error('Invalid name');
        mockAddCandidate.mockRejectedValue(validationError);
        mockReq = createMockReq(invalidCandidate);

        // Act
        await addCandidateController(mockReq as Request, mockRes as Response);

        // Assert
        expect(mockAddCandidate).toHaveBeenCalledWith(invalidCandidate);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Error adding candidate',
          error: 'Invalid name'
        });
      });

      it('debe retornar 400 cuando el nombre está vacío', async () => {
        // Arrange
        const emptyNameCandidate = {
          firstName: "",
          lastName: "García",
          email: "test@example.com"
        };
        const validationError = new Error('Invalid name');
        mockAddCandidate.mockRejectedValue(validationError);
        mockReq = createMockReq(emptyNameCandidate);

        // Act
        await addCandidateController(mockReq as Request, mockRes as Response);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Error adding candidate',
          error: 'Invalid name'
        });
      });

      it('debe retornar 400 cuando el email es inválido', async () => {
        // Arrange
        const invalidEmailCandidate = {
          firstName: "Carlos",
          lastName: "Hernández",
          email: "email-sin-formato-valido"
        };
        const validationError = new Error('Invalid email');
        mockAddCandidate.mockRejectedValue(validationError);
        mockReq = createMockReq(invalidEmailCandidate);

        // Act
        await addCandidateController(mockReq as Request, mockRes as Response);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Error adding candidate',
          error: 'Invalid email'
        });
      });

      it('debe retornar 400 cuando el teléfono no cumple el formato español', async () => {
        // Arrange
        const invalidPhoneCandidate = {
          firstName: "Luis",
          lastName: "Martín",
          email: "luis.martin@gmail.com",
          phone: "123456789" // No empieza por 6, 7 o 9
        };
        const validationError = new Error('Invalid phone');
        mockAddCandidate.mockRejectedValue(validationError);
        mockReq = createMockReq(invalidPhoneCandidate);

        // Act
        await addCandidateController(mockReq as Request, mockRes as Response);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Error adding candidate',
          error: 'Invalid phone'
        });
      });
    });

    describe('Errores de base de datos', () => {
      it('debe retornar 400 cuando el email ya existe (constraint único)', async () => {
        // Arrange
        const duplicateEmailCandidate = {
          firstName: "Pedro",
          lastName: "González",
          email: "maria.garcia@gmail.com" // Email que ya existe
        };
        const duplicateError = new Error('The email already exists in the database');
        mockAddCandidate.mockRejectedValue(duplicateError);
        mockReq = createMockReq(duplicateEmailCandidate);

        // Act
        await addCandidateController(mockReq as Request, mockRes as Response);

        // Assert
        expect(mockAddCandidate).toHaveBeenCalledWith(duplicateEmailCandidate);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Error adding candidate',
          error: 'The email already exists in the database'
        });
      });

      it('debe retornar 400 cuando hay error de conexión a la base de datos', async () => {
        // Arrange
        const dbConnectionError = new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
        mockAddCandidate.mockRejectedValue(dbConnectionError);
        mockReq = createMockReq(validCandidate);

        // Act
        await addCandidateController(mockReq as Request, mockRes as Response);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Error adding candidate',
          error: 'No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.'
        });
      });
    });

    describe('Errores de request malformado', () => {
      it('debe retornar 400 cuando el request body está vacío', async () => {
        // Arrange
        const validationError = new Error('Invalid name');
        mockAddCandidate.mockRejectedValue(validationError);
        mockReq = createMockReq({});

        // Act
        await addCandidateController(mockReq as Request, mockRes as Response);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Error adding candidate',
          error: 'Invalid name'
        });
      });

      it('debe retornar 400 cuando faltan campos obligatorios', async () => {
        // Arrange
        const incompleteCandidate = {
          firstName: "Isabel"
          // Falta lastName y email
        };
        const validationError = new Error('Invalid name');
        mockAddCandidate.mockRejectedValue(validationError);
        mockReq = createMockReq(incompleteCandidate);

        // Act
        await addCandidateController(mockReq as Request, mockRes as Response);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Error adding candidate',
          error: 'Invalid name'
        });
      });
    });

    describe('Manejo de errores desconocidos', () => {
      it('debe manejar errores que no son instancia de Error', async () => {
        // Arrange
        const unknownError = "String error no tipado";
        mockAddCandidate.mockRejectedValue(unknownError);
        mockReq = createMockReq(validCandidate);

        // Act
        await addCandidateController(mockReq as Request, mockRes as Response);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Error adding candidate',
          error: 'Unknown error'
        });
      });

      it('debe manejar errores null/undefined', async () => {
        // Arrange
        mockAddCandidate.mockRejectedValue(null);
        mockReq = createMockReq(validCandidate);

        // Act
        await addCandidateController(mockReq as Request, mockRes as Response);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Error adding candidate',
          error: 'Unknown error'
        });
      });

      it('debe manejar errores de tipo objeto sin message', async () => {
        // Arrange
        const objectError = { code: 'UNKNOWN', details: 'Something went wrong' };
        mockAddCandidate.mockRejectedValue(objectError);
        mockReq = createMockReq(validCandidate);

        // Act
        await addCandidateController(mockReq as Request, mockRes as Response);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Error adding candidate',
          error: 'Unknown error'
        });
      });
    });

    describe('Casos límite de datos', () => {
      it('debe manejar candidato con múltiples educaciones y experiencias', async () => {
        // Arrange
        const candidateWithMultipleData = {
          firstName: "Carmen",
          lastName: "Ruiz Jiménez",
          email: "carmen.ruiz@example.com",
          phone: "734567890",
          address: "Plaza España 45, Sevilla",
          educations: [
            {
              institution: "Universidad de Sevilla",
              title: "Grado en Matemáticas",
              startDate: "2015-09-01",
              endDate: "2019-06-30"
            },
            {
              institution: "Universidad Politécnica de Madrid",
              title: "Máster en Data Science",
              startDate: "2019-09-01",
              endDate: "2021-06-30"
            },
            {
              institution: "UNED",
              title: "Doctorado en Inteligencia Artificial",
              startDate: "2021-09-01"
            }
          ],
          workExperiences: [
            {
              company: "Repsol",
              position: "Data Analyst",
              description: "Análisis de datos de producción petrolera",
              startDate: "2019-07-01",
              endDate: "2020-12-31"
            },
            {
              company: "Inditex",
              position: "Senior Data Scientist",
              description: "Modelos predictivos para retail",
              startDate: "2021-01-15",
              endDate: "2023-06-30"
            },
            {
              company: "BBVA",
              position: "Lead Data Engineer",
              description: "Arquitectura de datos para banca digital",
              startDate: "2023-07-01"
            }
          ],
          cv: {
            filePath: "uploads/1715760936750-cv-carmen-ruiz.pdf",
            fileType: "application/pdf"
          }
        };
        const expectedCandidate = { 
          id: 4, 
          firstName: candidateWithMultipleData.firstName,
          lastName: candidateWithMultipleData.lastName,
          email: candidateWithMultipleData.email,
          phone: candidateWithMultipleData.phone,
          address: candidateWithMultipleData.address
        };
        mockAddCandidate.mockResolvedValue(expectedCandidate);
        mockReq = createMockReq(candidateWithMultipleData);

        // Act
        await addCandidateController(mockReq as Request, mockRes as Response);

        // Assert
        expect(mockAddCandidate).toHaveBeenCalledWith(candidateWithMultipleData);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Candidate added successfully',
          data: expectedCandidate
        });
      });

      it('debe manejar caracteres especiales en nombres españoles', async () => {
        // Arrange
        const candidateWithSpecialChars = {
          firstName: "María José",
          lastName: "Peña-Niñez",
          email: "mariajose.pena@example.com",
          phone: "687654321"
        };
        const expectedCandidate = { 
          id: 5, 
          firstName: candidateWithSpecialChars.firstName,
          lastName: candidateWithSpecialChars.lastName,
          email: candidateWithSpecialChars.email,
          phone: candidateWithSpecialChars.phone,
          address: null
        };
        mockAddCandidate.mockResolvedValue(expectedCandidate);
        mockReq = createMockReq(candidateWithSpecialChars);

        // Act
        await addCandidateController(mockReq as Request, mockRes as Response);

        // Assert
        expect(mockAddCandidate).toHaveBeenCalledWith(candidateWithSpecialChars);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: 'Candidate added successfully',
          data: expectedCandidate
        });
      });
    });
  });
}); 