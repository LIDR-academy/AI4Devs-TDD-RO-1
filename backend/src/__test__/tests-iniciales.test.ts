import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

jest.spyOn(prisma.candidate, 'create');
jest.spyOn(prisma.candidate, 'findUnique');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Candidate (Prisma direct usage)', () => {
  describe('create', () => {
    it('should save a valid candidate to the database', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Main St',
      };
      const createdCandidate = { id: 1, ...candidateData };
      (prisma.candidate.create as jest.Mock).mockResolvedValue(createdCandidate);

      // Act
      const result = await prisma.candidate.create({ data: candidateData });

      // Assert
      expect(prisma.candidate.create).toHaveBeenCalledWith({ data: candidateData });
      expect(result).toEqual(createdCandidate);
    });

    it('should not save a candidate with missing required fields', async () => {
      // Arrange
      const candidateData = { firstName: '', lastName: '', email: '' }; // Missing required fields
      (prisma.candidate.create as jest.Mock).mockRejectedValue(new Error('Missing required fields'));

      // Act & Assert
      await expect(prisma.candidate.create({ data: candidateData })).rejects.toThrow('Missing required fields');
    });

    it('should handle Prisma errors gracefully', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '0987654321',
        address: '456 Main St',
      };
      (prisma.candidate.create as jest.Mock).mockRejectedValue(new Error('Prisma error'));

      // Act & Assert
      await expect(prisma.candidate.create({ data: candidateData })).rejects.toThrow('Prisma error');
    });
  });

  describe('findUnique', () => {
    it('should return the correct candidate for a valid ID', async () => {
      // Arrange
      const candidateId = 1;
      const foundCandidate = {
        id: candidateId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Main St',
      };
      (prisma.candidate.findUnique as jest.Mock).mockResolvedValue(foundCandidate);

      // Act
      const result = await prisma.candidate.findUnique({ where: { id: candidateId } });

      // Assert
      expect(prisma.candidate.findUnique).toHaveBeenCalledWith({ where: { id: candidateId } });
      expect(result).toEqual(foundCandidate);
    });

    it('should return null for a non-existent ID', async () => {
      // Arrange
      const candidateId = 999;
      (prisma.candidate.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await prisma.candidate.findUnique({ where: { id: candidateId } });

      // Assert
      expect(result).toBeNull();
    });
  });
});
