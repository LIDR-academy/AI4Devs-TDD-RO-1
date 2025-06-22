import { addCandidate } from '../application/services/candidateService';
import { PrismaClient } from '@prisma/client';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';

// Mock Prisma Client and domain models
jest.mock('@prisma/client');
jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');

describe('addCandidate Service', () => {
  let mockCandidate: jest.Mocked<Candidate>;
  let mockEducation: jest.Mocked<Education>;
  let mockWorkExperience: jest.Mocked<WorkExperience>;
  let mockResume: jest.Mocked<Resume>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock implementations
    mockCandidate = {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      address: 'Calle Mayor 1, Madrid',
      education: [],
      workExperience: [],
      resumes: [],
      save: jest.fn().mockResolvedValue({ 
        id: 1, 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'juan.perez@example.com' 
      })
    } as any;

    mockEducation = {
      candidateId: 1,
      save: jest.fn().mockResolvedValue(true)
    } as any;

    mockWorkExperience = {
      candidateId: 1,
      save: jest.fn().mockResolvedValue(true)
    } as any;

    mockResume = {
      candidateId: 1,
      save: jest.fn().mockResolvedValue(true)
    } as any;

    (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidate);
    (Education as jest.MockedClass<typeof Education>).mockImplementation(() => mockEducation);
    (WorkExperience as jest.MockedClass<typeof WorkExperience>).mockImplementation(() => mockWorkExperience);
    (Resume as jest.MockedClass<typeof Resume>).mockImplementation(() => mockResume);
  });

  describe('Payload Validation Tests - Form Data Reception', () => {
    describe('Required Fields Validation', () => {
      it('should throw error when firstName is missing', async () => {
        // Arrange
        const invalidPayload = {
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid name');
      });

      it('should throw error when firstName is empty string', async () => {
        // Arrange
        const invalidPayload = {
          firstName: '',
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid name');
      });

      it('should throw error when lastName is missing', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'Juan',
          email: 'juan.perez@example.com'
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid name');
      });

      it('should throw error when email is missing', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'Juan',
          lastName: 'Pérez'
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid email');
      });
    });

    describe('Name Validation', () => {
      it('should throw error when firstName is too short', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'J',
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid name');
      });

      it('should throw error when firstName is too long', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'J'.repeat(101),
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid name');
      });

      it('should throw error when firstName contains invalid characters', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'Juan123',
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid name');
      });

      it('should accept names with Spanish accents', async () => {
        // Arrange
        const validPayload = {
          firstName: 'José María',
          lastName: 'García Fernández',
          email: 'jose.garcia@example.com'
        };

        // Act
        const result = await addCandidate(validPayload);

        // Assert
        expect(result).toBeDefined();
        expect(mockCandidate.save).toHaveBeenCalled();
      });
    });

    describe('Email Validation', () => {
      it('should throw error when email format is invalid', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'invalid-email'
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid email');
      });

      it('should throw error when email is missing @ symbol', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perezexample.com'
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid email');
      });

      it('should throw error when email is missing domain', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@'
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid email');
      });

      it('should accept valid email format', async () => {
        // Arrange
        const validPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
        };

        // Act
        const result = await addCandidate(validPayload);

        // Assert
        expect(result).toBeDefined();
        expect(mockCandidate.save).toHaveBeenCalled();
      });
    });

    describe('Phone Validation', () => {
      it('should throw error when phone format is invalid', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          phone: '512345678' // Should start with 6, 7, or 9
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid phone');
      });

      it('should throw error when phone is too short', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          phone: '61234567' // 8 digits instead of 9
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid phone');
      });

      it('should throw error when phone is too long', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          phone: '6123456789' // 10 digits instead of 9
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid phone');
      });

      it('should accept valid Spanish phone formats', async () => {
        // Arrange
        const testCases = [
          { phone: '612345678' }, // Mobile starting with 6
          { phone: '712345678' }, // Mobile starting with 7
          { phone: '912345678' }  // Mobile starting with 9
        ];

        for (const testCase of testCases) {
          const validPayload = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan.perez@example.com',
            ...testCase
          };

          // Act
          const result = await addCandidate(validPayload);

          // Assert
          expect(result).toBeDefined();
          expect(mockCandidate.save).toHaveBeenCalled();
        }
      });

      it('should accept candidate without phone (optional field)', async () => {
        // Arrange
        const validPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
          // phone is optional
        };

        // Act
        const result = await addCandidate(validPayload);

        // Assert
        expect(result).toBeDefined();
        expect(mockCandidate.save).toHaveBeenCalled();
      });
    });

    describe('Education Validation', () => {
      it('should throw error when education institution is missing', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          educations: [{
            title: 'Computer Science',
            startDate: '2020-09-01'
            // institution is missing
          }]
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid institution');
      });

      it('should throw error when education title is missing', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          educations: [{
            institution: 'Universidad Complutense',
            startDate: '2020-09-01'
            // title is missing
          }]
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid title');
      });

      it('should throw error when education startDate is invalid', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          educations: [{
            institution: 'Universidad Complutense',
            title: 'Computer Science',
            startDate: 'invalid-date'
          }]
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid date');
      });
    });

    describe('Work Experience Validation', () => {
      it('should throw error when work experience company is missing', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          workExperiences: [{
            position: 'Software Developer',
            startDate: '2021-01-01'
            // company is missing
          }]
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid company');
      });

      it('should throw error when work experience position is missing', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          workExperiences: [{
            company: 'Tech Corp',
            startDate: '2021-01-01'
            // position is missing
          }]
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid position');
      });
    });

    describe('CV Validation', () => {
      it('should throw error when CV data is invalid', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          cv: {
            // filePath is missing
            fileType: 'application/pdf'
          }
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid CV data');
      });

      it('should throw error when CV fileType is missing', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          cv: {
            filePath: '/uploads/cv.pdf'
            // fileType is missing
          }
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid CV data');
      });
    });
  });

  describe('Database Persistence Tests - Database Saving', () => {
    describe('Successful Candidate Creation', () => {
      it('should create candidate with minimal valid data', async () => {
        // Arrange
        const validPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
        };

        // Act
        const result = await addCandidate(validPayload);

        // Assert
        expect(Candidate).toHaveBeenCalledWith(validPayload);
        expect(mockCandidate.save).toHaveBeenCalled();
        expect(result).toEqual({
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
        });
      });

      it('should create candidate with complete data including optional fields', async () => {
        // Arrange
        const completePayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          phone: '612345678',
          address: 'Calle Mayor 1, Madrid',
          educations: [{
            institution: 'Universidad Complutense',
            title: 'Computer Science',
            startDate: '2020-09-01',
            endDate: '2024-06-30'
          }],
          workExperiences: [{
            company: 'Tech Corp',
            position: 'Software Developer',
            description: 'Full-stack development',
            startDate: '2021-01-01',
            endDate: '2023-12-31'
          }],
          cv: {
            filePath: '/uploads/cv.pdf',
            fileType: 'application/pdf'
          }
        };

        // Act
        const result = await addCandidate(completePayload);

        // Assert
        expect(Candidate).toHaveBeenCalledWith(completePayload);
        expect(mockCandidate.save).toHaveBeenCalled();
        expect(Education).toHaveBeenCalledWith(completePayload.educations[0]);
        expect(WorkExperience).toHaveBeenCalledWith(completePayload.workExperiences[0]);
        expect(Resume).toHaveBeenCalledWith(completePayload.cv);
        expect(result).toBeDefined();
      });
    });

    describe('Education Records Creation', () => {
      it('should create education records and associate them with candidate', async () => {
        // Arrange
        const payloadWithEducation = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          educations: [
            {
              institution: 'Universidad Complutense',
              title: 'Computer Science',
              startDate: '2020-09-01',
              endDate: '2024-06-30'
            },
            {
              institution: 'MIT',
              title: 'Masters in AI',
              startDate: '2024-09-01'
            }
          ]
        };

        // Act
        await addCandidate(payloadWithEducation);

        // Assert
        expect(Education).toHaveBeenCalledTimes(2);
        expect(Education).toHaveBeenCalledWith(payloadWithEducation.educations[0]);
        expect(Education).toHaveBeenCalledWith(payloadWithEducation.educations[1]);
        expect(mockEducation.save).toHaveBeenCalledTimes(2);
        expect(mockEducation.candidateId).toBe(1);
      });

      it('should skip education creation when educations array is empty', async () => {
        // Arrange
        const payloadWithoutEducation = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          educations: []
        };

        // Act
        await addCandidate(payloadWithoutEducation);

        // Assert
        expect(Education).not.toHaveBeenCalled();
        expect(mockEducation.save).not.toHaveBeenCalled();
      });
    });

    describe('Work Experience Records Creation', () => {
      it('should create work experience records and associate them with candidate', async () => {
        // Arrange
        const payloadWithExperience = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          workExperiences: [
            {
              company: 'Tech Corp',
              position: 'Junior Developer',
              description: 'Frontend development',
              startDate: '2021-01-01',
              endDate: '2022-12-31'
            },
            {
              company: 'Big Tech',
              position: 'Senior Developer',
              description: 'Full-stack development',
              startDate: '2023-01-01'
            }
          ]
        };

        // Act
        await addCandidate(payloadWithExperience);

        // Assert
        expect(WorkExperience).toHaveBeenCalledTimes(2);
        expect(WorkExperience).toHaveBeenCalledWith(payloadWithExperience.workExperiences[0]);
        expect(WorkExperience).toHaveBeenCalledWith(payloadWithExperience.workExperiences[1]);
        expect(mockWorkExperience.save).toHaveBeenCalledTimes(2);
        expect(mockWorkExperience.candidateId).toBe(1);
      });

      it('should skip work experience creation when workExperiences array is empty', async () => {
        // Arrange
        const payloadWithoutExperience = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          workExperiences: []
        };

        // Act
        await addCandidate(payloadWithoutExperience);

        // Assert
        expect(WorkExperience).not.toHaveBeenCalled();
        expect(mockWorkExperience.save).not.toHaveBeenCalled();
      });
    });

    describe('CV File Handling', () => {
      it('should create resume record and associate it with candidate', async () => {
        // Arrange
        const payloadWithCV = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          cv: {
            filePath: '/uploads/1715760936750-cv.pdf',
            fileType: 'application/pdf'
          }
        };

        // Act
        await addCandidate(payloadWithCV);

        // Assert
        expect(Resume).toHaveBeenCalledWith(payloadWithCV.cv);
        expect(mockResume.save).toHaveBeenCalled();
        expect(mockResume.candidateId).toBe(1);
      });

      it('should skip CV creation when cv object is empty', async () => {
        // Arrange
        const payloadWithoutCV = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          cv: {}
        };

        // Act
        await addCandidate(payloadWithoutCV);

        // Assert
        expect(Resume).not.toHaveBeenCalled();
        expect(mockResume.save).not.toHaveBeenCalled();
      });

      it('should skip CV creation when cv is undefined', async () => {
        // Arrange
        const payloadWithoutCV = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
          // cv is undefined
        };

        // Act
        await addCandidate(payloadWithoutCV);

        // Assert
        expect(Resume).not.toHaveBeenCalled();
        expect(mockResume.save).not.toHaveBeenCalled();
      });
    });

    describe('Error Handling', () => {
      it('should handle duplicate email error (P2002)', async () => {
        // Arrange
        const duplicateEmailPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'existing@example.com'
        };

        const duplicateError = new Error('Unique constraint failed');
        (duplicateError as any).code = 'P2002';
        mockCandidate.save.mockRejectedValue(duplicateError);

        // Act & Assert
        await expect(addCandidate(duplicateEmailPayload)).rejects.toThrow('The email already exists in the database');
      });

      it('should propagate other database errors', async () => {
        // Arrange
        const validPayload = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
        };

        const databaseError = new Error('Database connection failed');
        mockCandidate.save.mockRejectedValue(databaseError);

        // Act & Assert
        await expect(addCandidate(validPayload)).rejects.toThrow('Database connection failed');
      });

      it('should handle validation errors from validator', async () => {
        // Arrange
        const invalidPayload = {
          firstName: 'J', // Too short
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
        };

        // Act & Assert
        await expect(addCandidate(invalidPayload)).rejects.toThrow('Invalid name');
      });
    });

    describe('Data Flow Integration', () => {
      it('should pass validated data correctly through the entire flow', async () => {
        // Arrange
        const complexPayload = {
          firstName: 'María José',
          lastName: 'García Fernández',
          email: 'maria.garcia@example.com',
          phone: '687654321',
          address: 'Plaza España 10, 3ºA, Madrid, 28013',
          educations: [{
            institution: 'Universidad Politécnica de Madrid',
            title: 'Ingeniería Informática',
            startDate: '2018-09-01',
            endDate: '2022-06-30'
          }],
          workExperiences: [{
            company: 'Banco Santander',
            position: 'Analista de Sistemas',
            description: 'Desarrollo de aplicaciones bancarias',
            startDate: '2022-07-01',
            endDate: '2024-12-31'
          }],
          cv: {
            filePath: 'uploads/maria-garcia-cv.pdf',
            fileType: 'application/pdf'
          }
        };

        // Act
        const result = await addCandidate(complexPayload);

        // Assert
        // Verify candidate creation
        expect(Candidate).toHaveBeenCalledWith(complexPayload);
        expect(mockCandidate.save).toHaveBeenCalled();

        // Verify education creation
        expect(Education).toHaveBeenCalledWith(complexPayload.educations[0]);
        expect(mockEducation.candidateId).toBe(1);
        expect(mockEducation.save).toHaveBeenCalled();

        // Verify work experience creation
        expect(WorkExperience).toHaveBeenCalledWith(complexPayload.workExperiences[0]);
        expect(mockWorkExperience.candidateId).toBe(1);
        expect(mockWorkExperience.save).toHaveBeenCalled();

        // Verify CV creation
        expect(Resume).toHaveBeenCalledWith(complexPayload.cv);
        expect(mockResume.candidateId).toBe(1);
        expect(mockResume.save).toHaveBeenCalled();

        // Verify result
        expect(result).toBeDefined();
        expect(result.id).toBe(1);
      });
    });
  });
});
