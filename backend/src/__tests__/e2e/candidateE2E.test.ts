import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { app } from '../../index';

const prisma = new PrismaClient();

describe('Candidate E2E Tests', () => {
  beforeAll(async () => {
    // Conectar a la base de datos
    await prisma.$connect();
  });

  afterAll(async () => {
    // Cerrar conexión a la base de datos
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Limpiar la base de datos antes de cada test
    await prisma.resume.deleteMany();
    await prisma.workExperience.deleteMany();
    await prisma.education.deleteMany();
    await prisma.candidate.deleteMany();
  });

  describe('POST /candidates - End to End', () => {
    it('should create a candidate with complete data and save to database', async () => {
      // Datos completos del candidato (simulando formulario)
      const candidateData = {
        firstName: 'María',
        lastName: 'García',
        email: 'maria.garcia@test.com',
        phone: '612345678',
        address: 'Calle Mayor 123, Madrid',
        educations: [
          {
            institution: 'Universidad Complutense de Madrid',
            title: 'Ingeniería Informática',
            startDate: '2018-09-01',
            endDate: '2022-06-30'
          },
          {
            institution: 'IES Francisco de Goya',
            title: 'Bachillerato Tecnológico',
            startDate: '2016-09-01',
            endDate: '2018-06-30'
          }
        ],
        workExperiences: [
          {
            company: 'TechCorp Solutions',
            position: 'Desarrollador Full Stack Junior',
            description: 'Desarrollo de aplicaciones web con React y Node.js',
            startDate: '2022-07-01',
            endDate: '2023-12-31'
          }
        ],
        cv: {
          filePath: 'uploads/cv-maria-garcia.pdf',
          fileType: 'application/pdf'
        }
      };

      // 1. Enviar datos al backend (simulando envío desde formulario)
      const response = await request(app)
        .post('/candidates')
        .send(candidateData)
        .expect(201);

      // 2. Verificar respuesta del servidor
      expect(response.body).toBeDefined();
      expect(response.body.message).toBe('Candidate added successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.firstName).toBe(candidateData.firstName);
      expect(response.body.data.lastName).toBe(candidateData.lastName);
      expect(response.body.data.email).toBe(candidateData.email);

      const candidateId = response.body.data.id;

      // 3. Verificar que se guardó en la base de datos
      const savedCandidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
        include: {
          educations: true,
          workExperiences: true,
          resumes: true
        }
      });

      // Verificar candidato principal
      expect(savedCandidate).toBeDefined();
      expect(savedCandidate?.firstName).toBe(candidateData.firstName);
      expect(savedCandidate?.lastName).toBe(candidateData.lastName);
      expect(savedCandidate?.email).toBe(candidateData.email);
      expect(savedCandidate?.phone).toBe(candidateData.phone);
      expect(savedCandidate?.address).toBe(candidateData.address);

      // Verificar educación
      expect(savedCandidate?.educations).toHaveLength(2);
      expect(savedCandidate?.educations[0].institution).toBe(candidateData.educations[0].institution);
      expect(savedCandidate?.educations[0].title).toBe(candidateData.educations[0].title);
      expect(savedCandidate?.educations[1].institution).toBe(candidateData.educations[1].institution);

      // Verificar experiencia laboral
      expect(savedCandidate?.workExperiences).toHaveLength(1);
      expect(savedCandidate?.workExperiences[0].company).toBe(candidateData.workExperiences[0].company);
      expect(savedCandidate?.workExperiences[0].position).toBe(candidateData.workExperiences[0].position);
      expect(savedCandidate?.workExperiences[0].description).toBe(candidateData.workExperiences[0].description);

      // Verificar CV
      expect(savedCandidate?.resumes).toHaveLength(1);
      expect(savedCandidate?.resumes[0].filePath).toBe(candidateData.cv.filePath);
      expect(savedCandidate?.resumes[0].fileType).toBe(candidateData.cv.fileType);
    });

    it('should create a candidate with minimal data and save to database', async () => {
      // Datos mínimos (solo campos obligatorios)
      const candidateData = {
        firstName: 'Juan',
        lastName: 'López',
        email: 'juan.lopez@test.com',
        phone: '698765432',
        address: 'Avenida Principal 456, Barcelona',
        educations: [],
        workExperiences: [],
        cv: null
      };

      // Enviar datos al backend
      const response = await request(app)
        .post('/candidates')
        .send(candidateData)
        .expect(201);

      // Verificar respuesta
      expect(response.body.data.id).toBeDefined();
      const candidateId = response.body.data.id;

      // Verificar en base de datos
      const savedCandidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
        include: {
          educations: true,
          workExperiences: true,
          resumes: true
        }
      });

      expect(savedCandidate).toBeDefined();
      expect(savedCandidate?.firstName).toBe(candidateData.firstName);
      expect(savedCandidate?.email).toBe(candidateData.email);
      expect(savedCandidate?.educations).toHaveLength(0);
      expect(savedCandidate?.workExperiences).toHaveLength(0);
      expect(savedCandidate?.resumes).toHaveLength(0);
    });

    it('should reject duplicate email and not save to database', async () => {
      // Crear primer candidato
      const candidate1 = {
        firstName: 'Ana',
        lastName: 'Martínez',
        email: 'ana.martinez@test.com',
        phone: '611111111',
        address: 'Calle Test 1',
        educations: [],
        workExperiences: [],
        cv: null
      };

      await request(app)
        .post('/candidates')
        .send(candidate1)
        .expect(201);

      // Intentar crear segundo candidato con mismo email
      const candidate2 = {
        firstName: 'Pedro',
        lastName: 'Sánchez',
        email: 'ana.martinez@test.com', // Email duplicado
        phone: '622222222',
        address: 'Calle Test 2',
        educations: [],
        workExperiences: [],
        cv: null
      };

      const response = await request(app)
        .post('/candidates')
        .send(candidate2)
        .expect(400);

      expect(response.body.message).toBe('Error adding candidate');

      // Verificar que solo existe un candidato en la base de datos
      const candidates = await prisma.candidate.findMany({
        where: { email: 'ana.martinez@test.com' }
      });

      expect(candidates).toHaveLength(1);
    });

    it('should reject invalid data and not save to database', async () => {
      // Datos inválidos
      const invalidData = {
        firstName: '', // Nombre vacío
        lastName: 'Test',
        email: 'invalid-email', // Email inválido
        phone: '123', // Teléfono muy corto
        address: 'Test Address',
        educations: [],
        workExperiences: [],
        cv: null
      };

      const response = await request(app)
        .post('/candidates')
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toBe('Error adding candidate');

      // Verificar que no se guardó nada en la base de datos
      const candidates = await prisma.candidate.findMany();
      expect(candidates).toHaveLength(0);
    });
  });

  describe('GET /candidates - End to End', () => {
    it('should retrieve all candidates from database', async () => {
      // Crear candidatos de prueba
      const candidate1 = await prisma.candidate.create({
        data: {
          firstName: 'Test1',
          lastName: 'User1',
          email: 'test1@example.com',
          phone: '111111111',
          address: 'Address 1'
        }
      });

      const candidate2 = await prisma.candidate.create({
        data: {
          firstName: 'Test2',
          lastName: 'User2',
          email: 'test2@example.com',
          phone: '222222222',
          address: 'Address 2'
        }
      });

      // Obtener todos los candidatos
      const response = await request(app)
        .get('/candidates')
        .expect(200);

      // Verificar respuesta
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);

      // Verificar que los candidatos están en la respuesta
      const candidateEmails = response.body.map((c: any) => c.email);
      expect(candidateEmails).toContain('test1@example.com');
      expect(candidateEmails).toContain('test2@example.com');
    });

    it('should retrieve candidate by ID from database', async () => {
      // Crear candidato de prueba
      const candidate = await prisma.candidate.create({
        data: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '333333333',
          address: 'Test Address'
        }
      });

      // Obtener candidato por ID
      const response = await request(app)
        .get(`/candidates/${candidate.id}`)
        .expect(200);

      // Verificar respuesta
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(candidate.id);
      expect(response.body.firstName).toBe(candidate.firstName);
      expect(response.body.email).toBe(candidate.email);
    });

    it('should return 404 for non-existent candidate', async () => {
      const response = await request(app)
        .get('/candidates/99999')
        .expect(404);

      expect(response.body.message).toBe('Candidate not found');
    });
  });

  describe('Data Integrity Tests', () => {
    it('should maintain referential integrity with education and work experience', async () => {
      const candidateData = {
        firstName: 'Integrity',
        lastName: 'Test',
        email: 'integrity@test.com',
        phone: '444444444',
        address: 'Integrity Address',
        educations: [
          {
            institution: 'Test University',
            title: 'Test Degree',
            startDate: '2020-01-01',
            endDate: '2024-01-01'
          }
        ],
        workExperiences: [
          {
            company: 'Test Company',
            position: 'Test Position',
            description: 'Test Description',
            startDate: '2024-01-01',
            endDate: '2024-12-31'
          }
        ],
        cv: null
      };

      // Crear candidato
      const response = await request(app)
        .post('/candidates')
        .send(candidateData)
        .expect(201);

      const candidateId = response.body.data.id;

      // Verificar que las relaciones están correctamente establecidas
      const savedCandidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
        include: {
          educations: true,
          workExperiences: true
        }
      });

      expect(savedCandidate?.educations[0].candidateId).toBe(candidateId);
      expect(savedCandidate?.workExperiences[0].candidateId).toBe(candidateId);
    });
  });
}); 