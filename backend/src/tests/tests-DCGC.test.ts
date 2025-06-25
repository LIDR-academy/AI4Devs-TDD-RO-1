// Tests para verificar la configuración de Jest con TypeScript
// Este archivo contiene tests de ejemplo para validar que todo funciona correctamente

describe('Configuración de Jest con TypeScript', () => {
  test('debería poder ejecutar tests básicos', () => {
    expect(1 + 1).toBe(2);
    expect('hello' + ' world').toBe('hello world');
  });

  test('debería poder usar funciones de TypeScript', () => {
    const sum = (a: number, b: number): number => a + b;
    expect(sum(5, 3)).toBe(8);
  });

  test('debería poder usar interfaces de TypeScript', () => {
    interface User {
      id: number;
      name: string;
    }

    const user: User = {
      id: 1,
      name: 'Test User'
    };

    expect(user.id).toBe(1);
    expect(user.name).toBe('Test User');
  });
});

// Tests de ejemplo para los servicios existentes
describe('Candidate Service Tests', () => {
  test('debería poder importar el CandidateService', () => {
    // Este test verifica que podemos importar los módulos existentes
    expect(() => {
      require('../application/services/candidateService');
    }).not.toThrow();
  });
});

describe('File Upload Service Tests', () => {
  test('debería poder importar el FileUploadService', () => {
    // Este test verifica que podemos importar los módulos existentes
    expect(() => {
      require('../application/services/fileUploadService');
    }).not.toThrow();
  });
});

// Test de ejemplo para validar que Jest está configurado correctamente
describe('Jest Configuration', () => {
  test('debería tener acceso a todas las funciones de Jest', () => {
    // Verificar que las funciones de Jest están disponibles
    expect(typeof describe).toBe('function');
    expect(typeof test).toBe('function');
    expect(typeof expect).toBe('function');
    expect(typeof beforeEach).toBe('function');
    expect(typeof afterEach).toBe('function');
  });
});

// Tests para la funcionalidad de insertar candidatos
// Este archivo contiene tests unitarios para validación de datos y guardado en BD

// Mock de Prisma Client
const mockPrismaClient = {
  candidate: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn()
  },
  education: {
    create: jest.fn(),
    update: jest.fn()
  },
  workExperience: {
    create: jest.fn(),
    update: jest.fn()
  },
  resume: {
    create: jest.fn(),
    update: jest.fn()
  }
};

// Mock de los módulos
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
  Prisma: {
    PrismaClientInitializationError: class extends Error {
      constructor() {
        super('Database connection error');
        this.name = 'PrismaClientInitializationError';
      }
    }
  }
}));

// Importar los módulos después del mock
import { addCandidate } from '../application/services/candidateService';
import { validateCandidateData } from '../application/validator';
import { Candidate } from '../domain/models/Candidate';

// Limpiar mocks antes de cada test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Tests para insertar candidatos en base de datos', () => {
  
  // ========================================
  // FAMILIA 1: RECEPCIÓN DE DATOS DEL FORMULARIO
  // ========================================
  
  describe('Validación de datos del formulario', () => {
    
    test('debería validar datos requeridos correctamente', () => {
      const validData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@email.com'
      };
      
      expect(() => validateCandidateData(validData)).not.toThrow();
    });

    test('debería rechazar datos faltantes', () => {
      const invalidData = {
        firstName: 'Juan',
        // lastName faltante
        email: 'juan.perez@email.com'
      };
      
      expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
    });

    test('debería validar formato de email correctamente', () => {
      const validEmails = [
        'test@email.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ];
      
      validEmails.forEach(email => {
        const data = { firstName: 'Test', lastName: 'User', email };
        expect(() => validateCandidateData(data)).not.toThrow();
      });
    });

    test('debería rechazar emails con formato inválido', () => {
      const invalidEmails = [
        'invalid-email',
        '@email.com',
        'user@',
        'user.email'
      ];
      
      invalidEmails.forEach(email => {
        const data = { firstName: 'Test', lastName: 'User', email };
        expect(() => validateCandidateData(data)).toThrow('Invalid email');
      });
    });

    test('debería validar teléfono español correctamente', () => {
      const validPhones = ['612345678', '712345678', '912345678'];
      
      validPhones.forEach(phone => {
        const data = { 
          firstName: 'Test', 
          lastName: 'User', 
          email: 'test@email.com',
          phone 
        };
        expect(() => validateCandidateData(data)).not.toThrow();
      });
    });

    test('debería rechazar teléfonos con formato inválido', () => {
      const invalidPhones = ['123456789', '812345678', '61234567', '6123456789'];
      
      invalidPhones.forEach(phone => {
        const data = { 
          firstName: 'Test', 
          lastName: 'User', 
          email: 'test@email.com',
          phone 
        };
        expect(() => validateCandidateData(data)).toThrow('Invalid phone');
      });
    });

    test('debería validar fechas correctamente', () => {
      const validDates = ['2020-01-01', '2023-12-31', '1990-06-15'];
      
      validDates.forEach(date => {
        const data = {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@email.com',
          educations: [{
            institution: 'Universidad Test',
            title: 'Ingeniería',
            startDate: date,
            endDate: '2024-01-01'
          }]
        };
        expect(() => validateCandidateData(data)).not.toThrow();
      });
    });

    test('debería rechazar fechas con formato inválido', () => {
      const invalidDates = ['2020/01/01', '01-01-2020', '2020-13-01', 'invalid'];
      
      invalidDates.forEach(date => {
        const data = {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@email.com',
          educations: [{
            institution: 'Universidad Test',
            title: 'Ingeniería',
            startDate: date,
            endDate: '2024-01-01'
          }]
        };
        expect(() => validateCandidateData(data)).toThrow('Invalid date');
      });
    });

    test('debería validar educación correctamente', () => {
      const validEducation = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@email.com',
        educations: [{
          institution: 'Universidad Complutense',
          title: 'Ingeniería Informática',
          startDate: '2020-09-01',
          endDate: '2024-06-30'
        }]
      };
      
      expect(() => validateCandidateData(validEducation)).not.toThrow();
    });

    test('debería validar experiencia laboral correctamente', () => {
      const validExperience = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@email.com',
        workExperiences: [{
          company: 'Tech Company',
          position: 'Software Developer',
          description: 'Desarrollo de aplicaciones web',
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        }]
      };
      
      expect(() => validateCandidateData(validExperience)).not.toThrow();
    });
  });

  // ========================================
  // FAMILIA 2: GUARDADO EN BASE DE DATOS
  // ========================================
  
  describe('Guardado en base de datos', () => {
    
    test('debería insertar candidato básico exitosamente', async () => {
      const candidateData = {
        firstName: 'María',
        lastName: 'García',
        email: 'maria.garcia@email.com',
        phone: '612345678'
      };

      const mockSavedCandidate = {
        id: 1,
        ...candidateData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrismaClient.candidate.create.mockResolvedValue(mockSavedCandidate);

      const result = await addCandidate(candidateData);

      expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
        data: {
          firstName: 'María',
          lastName: 'García',
          email: 'maria.garcia@email.com',
          phone: '612345678'
        }
      });
      expect(result).toEqual(mockSavedCandidate);
    });

    test('debería insertar candidato con educación y experiencia', async () => {
      const candidateData = {
        firstName: 'Carlos',
        lastName: 'López',
        email: 'carlos.lopez@email.com',
        educations: [{
          institution: 'Universidad Politécnica',
          title: 'Ingeniería de Software',
          startDate: '2019-09-01',
          endDate: '2023-06-30'
        }],
        workExperiences: [{
          company: 'Startup Tech',
          position: 'Full Stack Developer',
          description: 'Desarrollo de aplicaciones web y móviles',
          startDate: '2023-07-01',
          endDate: '2024-01-31'
        }]
      };

      const mockSavedCandidate = {
        id: 2,
        firstName: 'Carlos',
        lastName: 'López',
        email: 'carlos.lopez@email.com',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock para el candidato principal
      mockPrismaClient.candidate.create.mockResolvedValue(mockSavedCandidate);
      
      // Mock para educación
      mockPrismaClient.education.create.mockResolvedValue({
        id: 1,
        institution: 'Universidad Politécnica',
        title: 'Ingeniería de Software',
        candidateId: 2
      });
      
      // Mock para experiencia laboral
      mockPrismaClient.workExperience.create.mockResolvedValue({
        id: 1,
        company: 'Startup Tech',
        position: 'Full Stack Developer',
        candidateId: 2
      });

      const result = await addCandidate(candidateData);

      // Verificar que se creó el candidato
      expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
        data: {
          firstName: 'Carlos',
          lastName: 'López',
          email: 'carlos.lopez@email.com'
        }
      });
      
      // Verificar que se creó la educación
      expect(mockPrismaClient.education.create).toHaveBeenCalledWith({
        data: {
          institution: 'Universidad Politécnica',
          title: 'Ingeniería de Software',
          startDate: expect.any(Date),
          endDate: expect.any(Date),
          candidateId: 2
        }
      });
      
      // Verificar que se creó la experiencia laboral
      expect(mockPrismaClient.workExperience.create).toHaveBeenCalledWith({
        data: {
          company: 'Startup Tech',
          position: 'Full Stack Developer',
          description: 'Desarrollo de aplicaciones web y móviles',
          startDate: expect.any(Date),
          endDate: expect.any(Date),
          candidateId: 2
        }
      });
      
      expect(result).toEqual(mockSavedCandidate);
    });

    test('debería manejar error de email duplicado', async () => {
      const candidateData = {
        firstName: 'Ana',
        lastName: 'Martínez',
        email: 'ana.martinez@email.com'
      };

      const duplicateEmailError = new Error();
      (duplicateEmailError as any).code = 'P2002';

      mockPrismaClient.candidate.create.mockRejectedValue(duplicateEmailError);

      await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
    });

    test('debería manejar error de conexión a base de datos', async () => {
      const candidateData = {
        firstName: 'Pedro',
        lastName: 'Sánchez',
        email: 'pedro.sanchez@email.com'
      };

      const connectionError = new Error('Database connection failed');
      connectionError.name = 'PrismaClientInitializationError';

      mockPrismaClient.candidate.create.mockRejectedValue(connectionError);

      await expect(addCandidate(candidateData)).rejects.toThrow('Database connection failed');
    });

    test('debería validar datos antes de intentar guardar', async () => {
      const invalidData = {
        firstName: '', // Nombre vacío
        lastName: 'Test',
        email: 'invalid-email' // Email inválido
      };

      // No debería llegar a llamar a la base de datos
      await expect(addCandidate(invalidData)).rejects.toThrow('Invalid name');
      
      expect(mockPrismaClient.candidate.create).not.toHaveBeenCalled();
    });

    test('debería manejar errores de validación correctamente', async () => {
      const invalidData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@email.com',
        educations: [{
          institution: '', // Institución vacía
          title: 'Ingeniería',
          startDate: '2020-01-01'
        }]
      };

      await expect(addCandidate(invalidData)).rejects.toThrow('Invalid institution');
      
      expect(mockPrismaClient.candidate.create).not.toHaveBeenCalled();
    });
  });

  // ========================================
  // TESTS DE INTEGRACIÓN ENTRE VALIDACIÓN Y GUARDADO
  // ========================================
  
  describe('Integración entre validación y guardado', () => {
    
    test('debería completar todo el flujo exitosamente', async () => {
      const completeData = {
        firstName: 'Laura',
        lastName: 'Fernández',
        email: 'laura.fernandez@email.com',
        phone: '712345678',
        address: 'Calle Mayor 123, Madrid',
        educations: [{
          institution: 'Universidad Autónoma',
          title: 'Ciencias de la Computación',
          startDate: '2018-09-01',
          endDate: '2022-06-30'
        }],
        workExperiences: [{
          company: 'Google',
          position: 'Software Engineer',
          description: 'Desarrollo de aplicaciones web escalables',
          startDate: '2022-07-01',
          endDate: '2024-01-31'
        }],
        cv: {
          filePath: '/uploads/cv_laura.pdf',
          fileType: 'application/pdf'
        }
      };

      const mockSavedCandidate = {
        id: 3,
        firstName: 'Laura',
        lastName: 'Fernández',
        email: 'laura.fernandez@email.com',
        phone: '712345678',
        address: 'Calle Mayor 123, Madrid',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock para el candidato principal
      mockPrismaClient.candidate.create.mockResolvedValue(mockSavedCandidate);
      
      // Mock para educación
      mockPrismaClient.education.create.mockResolvedValue({
        id: 1,
        institution: 'Universidad Autónoma',
        title: 'Ciencias de la Computación',
        candidateId: 3
      });
      
      // Mock para experiencia laboral
      mockPrismaClient.workExperience.create.mockResolvedValue({
        id: 1,
        company: 'Google',
        position: 'Software Engineer',
        candidateId: 3
      });
      
      // Mock para CV
      mockPrismaClient.resume.create.mockResolvedValue({
        id: 1,
        filePath: '/uploads/cv_laura.pdf',
        fileType: 'application/pdf',
        candidateId: 3,
        uploadDate: expect.any(Date)
      });

      const result = await addCandidate(completeData);

      // Verificar que se validó correctamente (no lanzó error)
      expect(result).toBeDefined();
      
      // Verificar que se creó el candidato
      expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
        data: {
          firstName: 'Laura',
          lastName: 'Fernández',
          email: 'laura.fernandez@email.com',
          phone: '712345678',
          address: 'Calle Mayor 123, Madrid'
        }
      });
      
      // Verificar que se creó la educación
      expect(mockPrismaClient.education.create).toHaveBeenCalledWith({
        data: {
          institution: 'Universidad Autónoma',
          title: 'Ciencias de la Computación',
          startDate: expect.any(Date),
          endDate: expect.any(Date),
          candidateId: 3
        }
      });
      
      // Verificar que se creó la experiencia laboral
      expect(mockPrismaClient.workExperience.create).toHaveBeenCalledWith({
        data: {
          company: 'Google',
          position: 'Software Engineer',
          description: 'Desarrollo de aplicaciones web escalables',
          startDate: expect.any(Date),
          endDate: expect.any(Date),
          candidateId: 3
        }
      });
      
      // Verificar que se creó el CV
      expect(mockPrismaClient.resume.create).toHaveBeenCalledWith({
        data: {
          filePath: '/uploads/cv_laura.pdf',
          fileType: 'application/pdf',
          candidateId: 3,
          uploadDate: expect.any(Date)
        }
      });
    });
  });
}); 