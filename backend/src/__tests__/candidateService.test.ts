import { addCandidate } from '../application/services/candidateService';
import { prismaMock } from './_helpers/prisma_mock';

describe('addCandidate service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear un candidato mínimo sin nested data', async () => {
    const input = { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com' };
    const saved = { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', phone: null, address: null };
    prismaMock.candidate.create.mockResolvedValue(saved as any);

    const result = await addCandidate(input);

    expect(prismaMock.candidate.create).toHaveBeenCalledWith({ data: { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com' } });
    expect(result).toEqual(saved);
  });

  it('debe crear educaciones adicionales', async () => {
    const input = {
      firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com',
      educations: [
        { institution: 'Uni A', title: 'BS', startDate: '2000-01-01', endDate: '2004-01-01' }
      ]
    };
    const saved = { id: 2, firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', phone: null, address: null };
    prismaMock.candidate.create.mockResolvedValue(saved as any);
    prismaMock.education.create.mockResolvedValue({
      id: 10,
      institution: input.educations[0].institution,
      title: input.educations[0].title,
      startDate: new Date(input.educations[0].startDate),
      endDate: new Date(input.educations[0].endDate!),
      candidateId: 2
    } as any);

    await addCandidate(input);

    expect(prismaMock.candidate.create).toHaveBeenCalled();
    expect(prismaMock.education.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.education.create).toHaveBeenCalledWith({ data: {
      institution: 'Uni A',
      title: 'BS',
      startDate: new Date('2000-01-01'),
      endDate: new Date('2004-01-01'),
      candidateId: 2
    } });
  });

  it('debe manejar error de validación', async () => {
    const bad = { firstName: '', lastName: 'X', email: 'x@x.com' };
    await expect(addCandidate(bad)).rejects.toThrow('Invalid name');
    expect(prismaMock.candidate.create).not.toHaveBeenCalled();
  });

  it('debe lanzar conflicto P2002', async () => {
    const input = { firstName: 'Carl', lastName: 'White', email: 'carl@example.com' };
    const error: any = { code: 'P2002' };
    prismaMock.candidate.create.mockRejectedValue(error);
    await expect(addCandidate(input)).rejects.toThrow('The email already exists in the database');
  });

  it('debe propagar error genérico de BD', async () => {
    const input = { firstName: 'Dana', lastName: 'Black', email: 'dana@example.com' };
    prismaMock.candidate.create.mockRejectedValue(new Error('unhandled'));
    await expect(addCandidate(input)).rejects.toThrow('unhandled');
  });
});
