import axios from 'axios';
import { uploadCV, sendCandidateData } from '../services/candidateService';

jest.mock('axios');

describe('candidateService', () => {
  describe('uploadCV', () => {
    it('should call axios.post with correct params', async () => {
      // Arrange
      const file = new File(['file content'], 'cv.pdf', { type: 'application/pdf' });
      const mockResponse = { data: { filePath: 'cv.pdf', fileType: 'pdf' } };
      axios.post.mockResolvedValue(mockResponse);

      // Act
      const result = await uploadCV(file);

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3010/upload',
        expect.any(FormData),
        expect.objectContaining({ headers: expect.any(Object) })
      );
      expect(result).toEqual(mockResponse.data);
    });
    it('should handle and propagate errors', async () => {
      // Arrange
      const file = new File(['file content'], 'cv.pdf', { type: 'application/pdf' });
      axios.post.mockRejectedValue({ response: { data: 'error' } });

      // Act & Assert
      await expect(uploadCV(file)).rejects.toThrow('Error al subir el archivo:');
    });
  });

  describe('sendCandidateData', () => {
    it('should call axios.post with correct params', async () => {
      // Arrange
      const candidateData = { firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      const mockResponse = { data: { id: 1, ...candidateData } };
      axios.post.mockResolvedValue(mockResponse);

      // Act
      const result = await sendCandidateData(candidateData);

      // Assert
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3010/candidates',
        candidateData
      );
      expect(result).toEqual(mockResponse.data);
    });
    it('should handle and propagate errors', async () => {
      // Arrange
      const candidateData = { firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      axios.post.mockRejectedValue({ response: { data: 'error' } });

      // Act & Assert
      await expect(sendCandidateData(candidateData)).rejects.toThrow('Error al enviar datos del candidato:');
    });
  });
});
