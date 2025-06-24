import { Request, Response } from 'express';
import { addCandidateController } from '../presentation/controllers/candidateController';
import * as candidateService from '../application/services/candidateService';

// Mock del servicio de candidatos
jest.mock('../application/services/candidateService');

describe('Candidate Controller', () => {
  // Setup para cada test
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJsonFn: jest.Mock;
  let mockStatusFn: jest.Mock;
  
  beforeEach(() => {
    // Reiniciar mocks
    jest.clearAllMocks();
    
    // Crear mocks para req y res
    mockJsonFn = jest.fn().mockReturnThis();
    mockStatusFn = jest.fn().mockReturnValue({ json: mockJsonFn });
    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: mockStatusFn,
      json: mockJsonFn
    };
  });

  it('debería crear un candidato con éxito y devolver código 201', async () => {
    // Arrange
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890'
    };
    
    const expectedCandidate = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'correo@ejemplo.com',
      phone: '1234567890',
      address: null,
    };
    
    mockRequest.body = candidateData;
    
    // Mock del servicio para que devuelva un candidato exitosamente
    jest.spyOn(candidateService, 'addCandidate').mockResolvedValue(expectedCandidate);
    
    // Act
    await addCandidateController(mockRequest as Request, mockResponse as Response);
    
    // Assert
    expect(candidateService.addCandidate).toHaveBeenCalledWith(candidateData);
    expect(mockStatusFn).toHaveBeenCalledWith(201);
    expect(mockJsonFn).toHaveBeenCalledWith({
      message: 'Candidate added successfully',
      data: expectedCandidate
    });
  });

  it('debería crear un candidato con datos completos (educación, experiencia y CV)', async () => {
    // Arrange
    const candidateData = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      phone: '9876543210',
      educations: [
        {
          institution: 'University A',
          title: 'Computer Science',
          startDate: '2015-09-01',
          endDate: '2019-06-30'
        }
      ],
      workExperiences: [
        {
          company: 'Tech Corp',
          position: 'Developer',
          description: 'Full stack development',
          startDate: '2019-07-01',
          endDate: '2022-12-31'
        }
      ],
      cv: {
        filePath: 'uploads/resume.pdf',
        fileType: 'application/pdf'
      }
    };
    
    const expectedCandidate = {
      id: 2,
      ...candidateData,
      education: [
        {
          id: 1,
          candidateId: 2,
          ...candidateData.educations[0]
        }
      ],
      address: null,
    };
    
    mockRequest.body = candidateData;
    
    // Mock del servicio
    jest.spyOn(candidateService, 'addCandidate').mockResolvedValue(expectedCandidate);
    
    // Act
    await addCandidateController(mockRequest as Request, mockResponse as Response);
    
    // Assert
    expect(candidateService.addCandidate).toHaveBeenCalledWith(candidateData);
    expect(mockStatusFn).toHaveBeenCalledWith(201);
    expect(mockJsonFn).toHaveBeenCalledWith({
      message: 'Candidate added successfully',
      data: expectedCandidate
    });
  });

  it('debería manejar errores de validación y devolver código 400', async () => {
    // Arrange
    const candidateData = {
      firstName: '', // Nombre inválido
      lastName: 'Doe',
      email: 'john@example.com'
    };
    
    mockRequest.body = candidateData;
    
    const validationError = new Error('Invalid name');
    jest.spyOn(candidateService, 'addCandidate').mockRejectedValue(validationError);
    
    // Act
    await addCandidateController(mockRequest as Request, mockResponse as Response);
    
    // Assert
    expect(candidateService.addCandidate).toHaveBeenCalledWith(candidateData);
    expect(mockStatusFn).toHaveBeenCalledWith(400);
    expect(mockJsonFn).toHaveBeenCalledWith({
      message: 'Error adding candidate',
      error: 'Invalid name'
    });
  });

  it('debería manejar errores de email duplicado y devolver código 400', async () => {
    // Arrange
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'existing@example.com' // Email ya existente
    };
    
    mockRequest.body = candidateData;
    
    const duplicateError = new Error('The email already exists in the database');
    jest.spyOn(candidateService, 'addCandidate').mockRejectedValue(duplicateError);
    
    // Act
    await addCandidateController(mockRequest as Request, mockResponse as Response);
    
    // Assert
    expect(candidateService.addCandidate).toHaveBeenCalledWith(candidateData);
    expect(mockStatusFn).toHaveBeenCalledWith(400);
    expect(mockJsonFn).toHaveBeenCalledWith({
      message: 'Error adding candidate',
      error: 'The email already exists in the database'
    });
  });

  it('debería manejar errores desconocidos y devolver código 400', async () => {
    // Arrange
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    };
    
    mockRequest.body = candidateData;
    
    // Un error que no es una instancia de Error
    jest.spyOn(candidateService, 'addCandidate').mockRejectedValue('Unknown error string');
    
    // Act
    await addCandidateController(mockRequest as Request, mockResponse as Response);
    
    // Assert
    expect(candidateService.addCandidate).toHaveBeenCalledWith(candidateData);
    expect(mockStatusFn).toHaveBeenCalledWith(400);
    expect(mockJsonFn).toHaveBeenCalledWith({
      message: 'Error adding candidate',
      error: 'Unknown error'
    });
  });
});