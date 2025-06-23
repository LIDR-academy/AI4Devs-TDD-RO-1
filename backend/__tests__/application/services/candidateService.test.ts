import fs from 'fs';
import path from 'path';
import { addCandidate } from '../../../src/application/services/candidateService';
import { Candidate } from '../../../src/domain/models/Candidate';
import { Education } from '../../../src/domain/models/Education';
import { WorkExperience } from '../../../src/domain/models/WorkExperience';
import { Resume } from '../../../src/domain/models/Resume';
import * as validator from '../../../src/application/validator';

// Mocks
jest.mock('../../../src/domain/models/Candidate');
jest.mock('../../../src/domain/models/Education');
jest.mock('../../../src/domain/models/WorkExperience');
jest.mock('../../../src/domain/models/Resume');
jest.mock('../../../src/application/validator');

describe('addCandidate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 2. Agregar candidato con todos los campos opcionales (incluyendo archivo PDF)
  it('debe guardar un candidato con educación, experiencia y CV (PDF)', async () => {
    // Lee el archivo PDF de pruebas
    const pdfPath = path.resolve(__dirname, '../files/test-cv.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);

    const candidateData = {
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana@mail.com',
      phone: '612345678',
      address: 'Calle Falsa 123',
      educations: [
        { institution: 'Universidad X', title: 'Ingeniería', startDate: '2015-01-01', endDate: '2019-01-01' }
      ],
      workExperiences: [
        { company: 'Empresa Y', position: 'Desarrolladora', startDate: '2019-02-01', endDate: '2021-01-01' }
      ],
      cv: { 
        fileBuffer: pdfBuffer, // Simula el buffer del archivo
        fileName: 'test-cv.pdf',
        fileType: 'application/pdf'
      }
    };

    (validator.validateCandidateData as jest.Mock).mockReturnValue(undefined);

    const saveMock = jest.fn().mockResolvedValue({ id: 1, ...candidateData });
    (Candidate as unknown as jest.Mock).mockImplementation(() => ({
      save: saveMock,
      education: [],
      workExperience: [],
      resumes: []
    }));

    (Education as jest.Mock).mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(data)
    }));

    (WorkExperience as jest.Mock).mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(data)
    }));

    (Resume as jest.Mock).mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue(data)
    }));

    const result = await addCandidate(candidateData);

    expect(validator.validateCandidateData).toHaveBeenCalledWith(candidateData);
    expect(saveMock).toHaveBeenCalled();
    expect(result).toHaveProperty('id');
  });

  // 3. Agregar candidato sin campos opcionales
  it('debe guardar un candidato aunque no tenga educación, experiencia ni CV', async () => {
    const candidateData = {
      firstName: 'Luis',
      lastName: 'Martínez',
      email: 'luis@mail.com'
    };

    (validator.validateCandidateData as jest.Mock).mockReturnValue(undefined);

    const saveMock = jest.fn().mockResolvedValue({ id: 2, ...candidateData });
    (Candidate as unknown as jest.Mock).mockImplementation(() => ({
      save: saveMock,
      education: [],
      workExperience: [],
      resumes: []
    }));

    const result = await addCandidate(candidateData);

    expect(validator.validateCandidateData).toHaveBeenCalledWith(candidateData);
    expect(saveMock).toHaveBeenCalled();
    expect(result).toHaveProperty('id');
  });

  // 8. WorkExperiences con datos inválidos
  it('debe lanzar error si alguna experiencia laboral tiene datos inválidos', async () => {
    const candidateData = {
      firstName: 'Pedro',
      lastName: 'López',
      email: 'pedro@mail.com',
      workExperiences: [
        { company: '', position: 'Dev', startDate: '2020-01-01', endDate: '2021-01-01' } // company vacío
      ]
    };

    // Simula que la validación lanza error
    (validator.validateCandidateData as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid work experience');
    });

    await expect(addCandidate(candidateData)).rejects.toThrow('Invalid work experience');
    expect(validator.validateCandidateData).toHaveBeenCalledWith(candidateData);
  });
});