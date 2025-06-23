import request from 'supertest';
import { app } from '../../src/index';
import * as candidateService from '../../src/application/services/candidateService';

// Mockear el servicio para evitar acceso real a la base de datos
jest.mock('../../src/application/services/candidateService');

describe('POST /candidates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Agregar candidato con datos mínimos válidos
  it('debe crear un candidato con datos mínimos válidos', async () => {
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@mail.com'
    };
    // Mock del servicio
    (candidateService.addCandidate as jest.Mock).mockResolvedValue({ id: 1, ...candidateData });

    const res = await request(app)
      .post('/candidates')
      .send(candidateData);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, ...candidateData });
    expect(candidateService.addCandidate).toHaveBeenCalledWith(candidateData);
  });

  // 2. Agregar candidato con todos los campos opcionales
  it('debe crear un candidato con todos los campos opcionales', async () => {
    const candidateData = {
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana.garcia@mail.com',
      phone: '612345678',
      address: 'Calle Falsa 123',
      educations: [
        { institution: 'Universidad X', title: 'Ingeniería', startDate: '2015-01-01', endDate: '2019-01-01' }
      ],
      workExperiences: [
        { company: 'Empresa Y', position: 'Desarrolladora', startDate: '2019-02-01', endDate: '2021-01-01' }
      ],
      cv: { filePath: '/files/ana.pdf', fileType: 'application/pdf' }
    };
    (candidateService.addCandidate as jest.Mock).mockResolvedValue({ id: 2, ...candidateData });

    const res = await request(app)
      .post('/candidates')
      .send(candidateData);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 2, ...candidateData });
    expect(candidateService.addCandidate).toHaveBeenCalledWith(candidateData);
  });

  // 4. Falta de campos obligatorios
  it('debe devolver 400 si falta el campo obligatorio firstName', async () => {
    const candidateData = {
      lastName: 'Pérez',
      email: 'juan.perez@mail.com'
    };
    // Simula que el servicio lanza un error de validación
    (candidateService.addCandidate as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid name');
    });

    const res = await request(app)
      .post('/candidates')
      .send(candidateData);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  // 5. Email con formato inválido
  it('debe devolver 400 si el email tiene formato inválido', async () => {
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'noesunemail'
    };
    (candidateService.addCandidate as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid email');
    });

    const res = await request(app)
      .post('/candidates')
      .send(candidateData);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});