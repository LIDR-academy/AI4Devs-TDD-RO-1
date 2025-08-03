import { addCandidate } from '../application/services/candidateService';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
import * as validator from '../application/validator';

jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');
jest.mock('../application/validator');

Candidate.prototype.save = jest.fn().mockResolvedValue({ id: 1, email: 'test@mail.com' });
Education.prototype.save = jest.fn().mockResolvedValue({ id: 10 });
WorkExperience.prototype.save = jest.fn().mockResolvedValue({ id: 20 });
Resume.prototype.save = jest.fn().mockResolvedValue({ id: 30 });
(validator.validateCandidateData as jest.Mock).mockImplementation((data) => true);

(Candidate as unknown as jest.Mock).mockImplementation((data: any) => ({
  ...data,
  education: [],
  workExperience: [],
  resumes: [],
  save: Candidate.prototype.save
}));

describe('addCandidate - recepción de datos del formulario', () => {
  it('debe aceptar datos válidos y procesarlos correctamente', async () => {
    const candidateData = {
      email: 'test@mail.com',
      educations: [{ degree: 'BSc' }],
      workExperiences: [{ company: 'TestCorp' }],
      cv: { filename: 'cv.pdf' }
    };
    await expect(addCandidate(candidateData)).resolves.toHaveProperty('id', 1);
  });

  it('debe lanzar error si los datos son inválidos', async () => {
    (validator.validateCandidateData as jest.Mock).mockImplementationOnce(() => { throw 'Datos inválidos'; });
    await expect(addCandidate({})).rejects.toThrow('Datos inválidos');
  });

  it('debe procesar datos incompletos sin educations ni workExperiences', async () => {
    const candidateData = { email: 'test@mail.com', cv: { filename: 'cv.pdf' } };
    await expect(addCandidate(candidateData)).resolves.toHaveProperty('id', 1);
  });
});

describe('addCandidate - guardado en base de datos (mock Prisma)', () => {
  it('debe guardar el candidato y retornar el objeto guardado', async () => {
    const candidateData = { email: 'test@mail.com' };
    await expect(addCandidate(candidateData)).resolves.toHaveProperty('id', 1);
  });

  it('debe guardar educación y experiencia laboral asociada', async () => {
    const candidateData = {
      email: 'test@mail.com',
      educations: [{ degree: 'BSc' }],
      workExperiences: [{ company: 'TestCorp' }]
    };
    await expect(addCandidate(candidateData)).resolves.toHaveProperty('id', 1);
    expect(Education.prototype.save).toHaveBeenCalled();
    expect(WorkExperience.prototype.save).toHaveBeenCalled();
  });

  it('debe lanzar error si Prisma retorna código de email duplicado', async () => {
    (Candidate.prototype.save as jest.Mock).mockRejectedValueOnce({ code: 'P2002' });
    await expect(addCandidate({ email: 'duplicate@mail.com' })).rejects.toThrow('The email already exists in the database');
  });
});
