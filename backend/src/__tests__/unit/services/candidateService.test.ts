import { addCandidate } from '../../../application/services/candidateService';

// Mock del módulo @prisma/client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    candidate: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    education: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    workExperience: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    resume: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

// Mock del validador
jest.mock('../../../application/validator', () => ({
  validateCandidateData: jest.fn(),
}));

// Importar el mock después de definirlo
const { PrismaClient } = require('@prisma/client');
const mockPrisma = new PrismaClient();

describe('CandidateService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addCandidate', () => {
    it('should create a candidate successfully', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '612345678',
        address: '123 Main St'
      };

      const mockCandidate = {
        id: 1,
        ...candidateData,
        educations: [],
        workExperiences: [],
        resumes: []
      };

      mockPrisma.candidate.create.mockResolvedValue(mockCandidate);

      const result = await addCandidate(candidateData, mockPrisma);
      
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
        data: {
          firstName: candidateData.firstName,
          lastName: candidateData.lastName,
          email: candidateData.email,
          phone: candidateData.phone,
          address: candidateData.address,
          educations: undefined,
          workExperiences: undefined,
          resumes: undefined
        },
        include: {
          educations: true,
          workExperiences: true,
          resumes: true
        }
      });
    });

    it('should create candidate with education and work experience', async () => {
      const candidateData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '698765432',
        address: '456 Oak Ave',
        educations: [
          {
            institution: 'University of Test',
            title: 'Computer Science',
            startDate: '2018-09-01',
            endDate: '2022-06-30'
          }
        ],
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Software Engineer',
            description: 'Full stack development',
            startDate: '2022-07-01',
            endDate: '2023-12-31'
          }
        ]
      };

      const mockCandidate = {
        id: 2,
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        email: candidateData.email,
        phone: candidateData.phone,
        address: candidateData.address,
        educations: candidateData.educations,
        workExperiences: candidateData.workExperiences,
        resumes: []
      };

      mockPrisma.candidate.create.mockResolvedValue(mockCandidate);

      const result = await addCandidate(candidateData, mockPrisma);
      
      expect(result).toBeDefined();
      expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
        data: {
          firstName: candidateData.firstName,
          lastName: candidateData.lastName,
          email: candidateData.email,
          phone: candidateData.phone,
          address: candidateData.address,
          educations: {
            create: candidateData.educations.map(edu => ({
              institution: edu.institution,
              title: edu.title,
              startDate: edu.startDate,
              endDate: edu.endDate
            }))
          },
          workExperiences: {
            create: candidateData.workExperiences.map(exp => ({
              company: exp.company,
              position: exp.position,
              description: exp.description,
              startDate: exp.startDate,
              endDate: exp.endDate
            }))
          },
          resumes: undefined
        },
        include: {
          educations: true,
          workExperiences: true,
          resumes: true
        }
      });
    });

    it('should create candidate with CV', async () => {
      const candidateData = {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        phone: '611111111',
        address: '789 Pine St',
        cv: {
          filePath: 'uploads/cv.pdf',
          fileType: 'application/pdf'
        }
      };

      const mockCandidate = {
        id: 3,
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        email: candidateData.email,
        phone: candidateData.phone,
        address: candidateData.address,
        educations: [],
        workExperiences: [],
        resumes: [candidateData.cv]
      };

      mockPrisma.candidate.create.mockResolvedValue(mockCandidate);

      const result = await addCandidate(candidateData, mockPrisma);
      
      expect(result).toBeDefined();
      expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
        data: {
          firstName: candidateData.firstName,
          lastName: candidateData.lastName,
          email: candidateData.email,
          phone: candidateData.phone,
          address: candidateData.address,
          educations: undefined,
          workExperiences: undefined,
          resumes: {
            create: [{
              filePath: candidateData.cv.filePath,
              fileType: candidateData.cv.fileType,
              uploadDate: expect.any(Date)
            }]
          }
        },
        include: {
          educations: true,
          workExperiences: true,
          resumes: true
        }
      });
    });

    it('should throw error when candidate creation fails', async () => {
      const candidateData = {
        firstName: 'Error',
        lastName: 'Test',
        email: 'error@test.com'
      };

      mockPrisma.candidate.create.mockRejectedValue(new Error('Database error'));

      await expect(addCandidate(candidateData, mockPrisma)).rejects.toThrow('Database error');
    });

    it('should throw specific error for duplicate email', async () => {
      const candidateData = {
        firstName: 'Duplicate',
        lastName: 'Email',
        email: 'duplicate@test.com'
      };

      const duplicateError = new Error('Duplicate email');
      (duplicateError as any).code = 'P2002';
      mockPrisma.candidate.create.mockRejectedValue(duplicateError);

      await expect(addCandidate(candidateData, mockPrisma)).rejects.toThrow('The email already exists in the database');
    });
  });
}); 