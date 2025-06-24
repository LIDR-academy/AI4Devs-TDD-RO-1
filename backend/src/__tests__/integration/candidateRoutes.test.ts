import request from 'supertest';
import express, { Request, Response } from 'express';
import candidateRoutes from '../../routes/candidateRoutes';

// Mock de los controladores
jest.mock('../../presentation/controllers/candidateController', () => ({
  addCandidateController: jest.fn(),
  getAllCandidates: jest.fn(),
  getCandidateById: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/candidates', candidateRoutes);

describe('Candidate Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /candidates', () => {
    it('should create a candidate successfully', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        address: 'Test Address',
        educations: [],
        workExperiences: [],
        cv: null
      };

      const { addCandidateController } = require('../../presentation/controllers/candidateController');
      addCandidateController.mockImplementation((req: Request, res: Response) => {
        res.status(201).json({
          message: 'Candidate added successfully',
          data: { id: 1, ...candidateData }
        });
      });

      const response = await request(app)
        .post('/candidates')
        .send(candidateData)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.message).toBe('Candidate added successfully');
      expect(addCandidateController).toHaveBeenCalled();
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        firstName: '', // Invalid: empty first name
        lastName: 'Doe',
        email: 'invalid-email', // Invalid email format
        phone: '123456789',
        address: 'Test Address',
        educations: [],
        workExperiences: [],
        cv: null
      };

      const { addCandidateController } = require('../../presentation/controllers/candidateController');
      addCandidateController.mockImplementation((req: Request, res: Response) => {
        res.status(400).json({ message: 'Error adding candidate', error: 'Validation error' });
      });

      const response = await request(app)
        .post('/candidates')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /candidates', () => {
    it('should return all candidates', async () => {
      const { getAllCandidates } = require('../../presentation/controllers/candidateController');
      getAllCandidates.mockImplementation((req: Request, res: Response) => {
        res.status(200).json([]);
      });

      const response = await request(app)
        .get('/candidates')
        .expect(200);

      expect(response.body).toEqual([]);
      expect(getAllCandidates).toHaveBeenCalled();
    });
  });

  describe('GET /candidates/:id', () => {
    it('should return candidate by id', async () => {
      const { getCandidateById } = require('../../presentation/controllers/candidateController');
      getCandidateById.mockImplementation((req: Request, res: Response) => {
        res.status(200).json({ id: 1, firstName: 'John', lastName: 'Doe' });
      });

      const response = await request(app)
        .get('/candidates/1')
        .expect(200);

      expect(response.body).toEqual({ id: 1, firstName: 'John', lastName: 'Doe' });
      expect(getCandidateById).toHaveBeenCalled();
    });

    it('should return 404 for non-existent candidate', async () => {
      const { getCandidateById } = require('../../presentation/controllers/candidateController');
      getCandidateById.mockImplementation((req: Request, res: Response) => {
        res.status(404).json({ message: 'Candidate not found' });
      });

      const response = await request(app)
        .get('/candidates/999')
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });
}); 