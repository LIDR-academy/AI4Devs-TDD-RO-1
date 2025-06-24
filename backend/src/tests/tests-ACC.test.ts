jest.mock('../domain/models/Candidate', () => ({ Candidate: jest.fn() }));
jest.mock('../domain/models/Education', () => ({
  Education: jest.fn(() => ({ save: jest.fn().mockResolvedValue({}) }))
}));
jest.mock('../domain/models/WorkExperience', () => ({
  WorkExperience: jest.fn(() => ({ save: jest.fn().mockResolvedValue({}) }))
}));
jest.mock('../domain/models/Resume', () => ({
  Resume: jest.fn(() => ({ save: jest.fn().mockResolvedValue({}) }))
}));
jest.mock('../application/validator', () => ({ validateCandidateData: jest.fn() }));

import request from 'supertest';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import * as candidateService from '../application/services/candidateService';
import candidateRoutes from '../routes/candidateRoutes';
import { addCandidate } from '../application/services/candidateService';
import { Candidate } from '../domain/models/Candidate';
import { validateCandidateData } from '../application/validator';

const CandidateMock = Candidate as unknown as jest.Mock;
const validateCandidateDataMock = validateCandidateData as jest.Mock;

const mockCandidate = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '1234567890',
  address: '123 Main St',
  educations: [{ degree: 'BSc', institution: 'Uni', year: 2020 }],
  workExperiences: [{ company: 'Company', role: 'Dev', years: 2 }],
  resumes: [{ url: 'resume.pdf' }],
};

// --- Service Layer ---
jest.mock('../domain/models/Candidate', () => {
  return {
    Candidate: jest.fn()
  };
});
jest.mock('../domain/models/Education', () => {
  return {
    Education: jest.fn(() => ({ save: jest.fn().mockResolvedValue({}) }))
  };
});
jest.mock('../domain/models/WorkExperience', () => {
  return {
    WorkExperience: jest.fn(() => ({ save: jest.fn().mockResolvedValue({}) }))
  };
});
jest.mock('../domain/models/Resume', () => {
  return {
    Resume: jest.fn(() => ({ save: jest.fn().mockResolvedValue({}) }))
  };
});
jest.mock('../application/validator', () => ({
  validateCandidateData: jest.fn()
}));

describe('Add Candidate Feature', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(bodyParser.json());
    app.use('/', candidateRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service: addCandidate', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should add a candidate with valid data', async () => {
      // Arrange
      validateCandidateDataMock.mockImplementation(() => {});
      const saveMock = jest.fn().mockResolvedValue({ id: 1, ...mockCandidate });
      CandidateMock.mockImplementation(() => ({ save: saveMock, education: [], workExperience: [], resumes: [] }));
      // Act
      const result = await addCandidate(mockCandidate);
      // Assert
      expect(validateCandidateDataMock).toHaveBeenCalled();
      expect(saveMock).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
      expect(result.email).toBe(mockCandidate.email);
    });

    it('should throw error if required fields are missing', async () => {
      // Arrange
      validateCandidateDataMock.mockImplementation(() => { throw new Error('Missing required fields'); });
      const { firstName, ...invalidData } = mockCandidate;
      // Act & Assert
      await expect(addCandidate(invalidData)).rejects.toThrow('Missing required fields');
    });

    it('should throw error for duplicate email', async () => {
      // Arrange
      validateCandidateDataMock.mockImplementation(() => {});
      const error = new Error('The email already exists in the database');
      // @ts-ignore
      error.code = 'P2002';
      const saveMock = jest.fn().mockRejectedValue(error);
      CandidateMock.mockImplementation(() => ({ save: saveMock, education: [], workExperience: [], resumes: [] }));
      // Act & Assert
      await expect(addCandidate(mockCandidate)).rejects.toThrow('The email already exists in the database');
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      validateCandidateDataMock.mockImplementation(() => {});
      const saveMock = jest.fn().mockRejectedValue(new Error('DB error'));
      CandidateMock.mockImplementation(() => ({ save: saveMock, education: [], workExperience: [], resumes: [] }));
      // Act & Assert
      await expect(addCandidate(mockCandidate)).rejects.toThrow('DB error');
    });

    it('should ignore extra/unexpected fields in input', async () => {
      // Arrange
      validateCandidateDataMock.mockImplementation(() => {});
      const saveMock = jest.fn().mockResolvedValue({ id: 2, ...mockCandidate });
      CandidateMock.mockImplementation(() => ({ save: saveMock, education: [], workExperience: [], resumes: [] }));
      const dataWithExtra = { ...mockCandidate, extraField: 'ignore me' };
      // Act
      const result = await addCandidate(dataWithExtra);
      // Assert
      expect(result).toHaveProperty('id');
      expect(result).not.toHaveProperty('extraField');
    });
  });

  // --- Controller Layer ---
  describe('Controller: addCandidateController', () => {
    let addCandidateSpy: jest.SpyInstance;
    beforeEach(() => {
      addCandidateSpy = jest.spyOn(candidateService, 'addCandidate');
    });
    afterEach(() => {
      addCandidateSpy.mockReset();
    });

    it('should return 201 and candidate data on success', async () => {
      // Arrange
      addCandidateSpy.mockResolvedValue({ id: 1, ...mockCandidate });
      // Act
      const response = await request(app).post('/').send(mockCandidate);
      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(mockCandidate.email);
    });

    it('should return 400 if required fields are missing', async () => {
      // Arrange
      addCandidateSpy.mockImplementation(() => { throw new Error('Missing required fields'); });
      const { firstName, ...invalidData } = mockCandidate;
      // Act
      const response = await request(app).post('/').send(invalidData);
      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/missing required fields/i);
    });

    it('should return 400 for duplicate email', async () => {
      // Arrange
      addCandidateSpy.mockImplementation(() => { throw new Error('The email already exists in the database'); });
      // Act
      const response = await request(app).post('/').send(mockCandidate);
      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/email already exists/i);
    });
  });

  // --- Route Layer ---
  describe('Route: POST /', () => {
    let addCandidateSpy: jest.SpyInstance;
    beforeEach(() => {
      addCandidateSpy = jest.spyOn(candidateService, 'addCandidate');
    });
    afterEach(() => {
      addCandidateSpy.mockReset();
    });

    it('should add candidate and return 201', async () => {
      // Arrange
      addCandidateSpy.mockResolvedValue({ id: 1, ...mockCandidate });
      // Act
      const response = await request(app).post('/').send(mockCandidate);
      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 400 for invalid data', async () => {
      // Arrange
      addCandidateSpy.mockImplementation(() => { throw new Error('Invalid data'); });
      const { email, ...invalidData } = mockCandidate;
      // Act
      const response = await request(app).post('/').send(invalidData);
      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/invalid data/i);
    });

    it('should return 400 for duplicate email', async () => {
      // Arrange
      addCandidateSpy.mockImplementation(() => { throw new Error('The email already exists in the database'); });
      // Act
      const response = await request(app).post('/').send(mockCandidate);
      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/email already exists/i);
    });
  });
});
