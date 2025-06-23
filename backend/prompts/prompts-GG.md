# Prompts Used with GitHub Copilot - LTI ATS Unit Tests (GG)

## Project: LTI ATS - Jest Unit Test Suite for Candidate Insertion

### Task: Create comprehensive Jest unit tests for candidate insertion functionality covering form data validation and database persistence with mocked Prisma.

---

## Prompt 1: Initial Test File Setup

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Setting up the main test file structure and imports

**Prompt:**

```typescript
// tests-GG.test.ts
// Create comprehensive Jest unit tests for candidateService addCandidate function
// Need to test form validation and database persistence with mocked Prisma
// Use TypeScript, follow TDD/AAA pattern, mock all external dependencies

import { addCandidate } from '../application/services/candidateService';
import { PrismaClient } from '@prisma/client';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
```

---

## Prompt 2: Jest Mocks Setup

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Setting up Jest mocks for Prisma and domain models

**Prompt:**

```typescript
// Mock all external dependencies first
jest.mock('@prisma/client');
jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');

describe('addCandidate Service', () => {
  let mockCandidate: jest.Mocked<Candidate>;
  let mockEducation: jest.Mocked<Education>;
  let mockWorkExperience: jest.Mocked<WorkExperience>;
  let mockResume: jest.Mocked<Resume>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock candidate with save method
    mockCandidate = {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      save: jest.fn().mockResolvedValue({ id: 1 })
    } as any;
```

---

## Prompt 3: Required Fields Validation Tests

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Creating tests for required field validation

**Prompt:**

```typescript
  describe('Payload Validation Tests - Form Data Reception', () => {
    describe('Required Fields Validation', () => {
      it('should throw error when firstName is missing', async () => {
        // Arrange
        const candidateData = {
          lastName: 'Pérez',
          email: 'test@example.com'
        };

        // Act & Assert
        await expect(addCandidate(candidateData)).rejects.toThrow('First name is required');
      });

      it('should throw error when firstName is empty string', async () => {
        const candidateData = {
          firstName: '',
          lastName: 'Pérez',
          email: 'test@example.com'
        };
        await expect(addCandidate(candidateData)).rejects.toThrow('First name is required');
      });
```

---

## Prompt 4: Name Format Validation Tests

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Testing name length and character validation

**Prompt:**

```typescript
    describe('Name Validation', () => {
      it('should throw error when firstName is too short', async () => {
        const candidateData = {
          firstName: 'A',  // Only 1 character
          lastName: 'Pérez',
          email: 'test@example.com'
        };
        await expect(addCandidate(candidateData)).rejects.toThrow('must be between 2 and 100 characters');
      });

      it('should throw error when firstName is too long', async () => {
        const candidateData = {
          firstName: 'A'.repeat(101), // 101 characters
          lastName: 'Pérez',
          email: 'test@example.com'
        };
        await expect(addCandidate(candidateData)).rejects.toThrow('must be between 2 and 100 characters');
      });

      it('should accept names with Spanish accents', async () => {
        const candidateData = {
          firstName: 'José María',
          lastName: 'González-Pérez',
          email: 'jose@example.com'
        };
        // Should not throw error for valid Spanish names
      });
```

---

## Prompt 5: Email Validation Tests

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Testing email format validation

**Prompt:**

```typescript
    describe('Email Validation', () => {
      it('should throw error when email format is invalid', async () => {
        const candidateData = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'invalid-email'
        };
        await expect(addCandidate(candidateData)).rejects.toThrow('Invalid email format');
      });

      it('should throw error when email is missing @ symbol', async () => {
        const candidateData = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'testexample.com'
        };
        await expect(addCandidate(candidateData)).rejects.toThrow('Invalid email format');
      });

      it('should accept valid email format', async () => {
        const candidateData = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
        };
        // Should not throw for valid email
      });
```

---

## Prompt 6: Phone Validation Tests

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Testing Spanish phone format validation

**Prompt:**

```typescript
    describe('Phone Validation', () => {
      it('should throw error when phone format is invalid', async () => {
        const candidateData = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com',
          phone: '123456789' // Doesn't start with 6,7,9
        };
        await expect(addCandidate(candidateData)).rejects.toThrow('Phone must start with 6, 7, or 9');
      });

      it('should accept valid Spanish phone formats', async () => {
        const testCases = ['612345678', '723456789', '987654321'];
        for (const phone of testCases) {
          const candidateData = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@example.com',
            phone
          };
          // Should not throw for valid phone formats
        }
      });

      it('should accept candidate without phone (optional field)', async () => {
        const candidateData = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com'
          // phone is optional
        };
        // Should not throw when phone is missing
      });
```

---

## Prompt 7: Database Persistence Tests Setup

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Testing database operations with Prisma mocks

**Prompt:**

```typescript
  describe('Database Persistence Tests - Database Saving', () => {
    describe('Successful Candidate Creation', () => {
      it('should create candidate with minimal valid data', async () => {
        // Arrange
        const candidateData = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
        };

        // Mock successful save
        mockCandidate.save.mockResolvedValue({
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
        });

        // Act
        const result = await addCandidate(candidateData);

        // Assert
        expect(mockCandidate.save).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez'
        }));
      });
```

---

## Prompt 8: Error Handling Tests

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Testing database error scenarios

**Prompt:**

```typescript
    describe('Error Handling', () => {
      it('should handle duplicate email error (P2002)', async () => {
        const candidateData = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'existing@example.com'
        };

        // Mock Prisma P2002 error (unique constraint violation)
        const prismaError = new Error('Unique constraint failed');
        (prismaError as any).code = 'P2002';
        mockCandidate.save.mockRejectedValue(prismaError);

        await expect(addCandidate(candidateData)).rejects.toThrow('Email already exists');
      });

      it('should propagate other database errors', async () => {
        const candidateData = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com'
        };

        const dbError = new Error('Database connection failed');
        mockCandidate.save.mockRejectedValue(dbError);

        await expect(addCandidate(candidateData)).rejects.toThrow('Database connection failed');
      });
```

---

## Prompt 9: Jest Configuration

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Setting up Jest for TypeScript

**Prompt:**

```javascript
// jest.config.js
// Create Jest configuration for TypeScript project with ts-jest preset
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
```

---

## Prompt 10: Integration Test

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Creating end-to-end data flow test

**Prompt:**

```typescript
    describe('Data Flow Integration', () => {
      it('should pass validated data correctly through the entire flow', async () => {
        // Arrange - Complete candidate data with all fields
        const candidateData = {
          firstName: 'María José',
          lastName: 'García-Pérez',
          email: 'maria.garcia@example.com',
          phone: '612345678',
          address: 'Calle Mayor 1, Madrid',
          educations: [{
            institution: 'Universidad de Madrid',
            title: 'Computer Science',
            startDate: '2018-09-01',
            endDate: '2022-06-30'
          }],
          workExperiences: [{
            company: 'Tech Corp',
            position: 'Software Developer',
            startDate: '2022-07-01',
            endDate: '2024-12-31'
          }],
          cv: {
            filePath: 'uploads/cv.pdf',
            fileType: 'application/pdf'
          }
        };

        // Mock all successful operations
        mockCandidate.save.mockResolvedValue({ id: 1, ...candidateData });
        mockEducation.save.mockResolvedValue(true);
        mockWorkExperience.save.mockResolvedValue(true);
        mockResume.save.mockResolvedValue(true);

        // Act
        const result = await addCandidate(candidateData);

        // Assert - Verify all components were called correctly
        expect(mockCandidate.save).toHaveBeenCalled();
        expect(mockEducation.save).toHaveBeenCalled();
        expect(mockWorkExperience.save).toHaveBeenCalled();
        expect(mockResume.save).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
          id: 1,
          firstName: 'María José',
          email: 'maria.garcia@example.com'
        }));
      });
    });
  });
});
```

---

## Summary

These prompts were used with GitHub Copilot to create a comprehensive Jest unit test suite with 37 tests covering:

**Form Data Validation (24 tests):**

- Required fields validation (firstName, lastName, email)
- Name format validation (length, characters, Spanish accents)
- Email format validation
- Phone format validation (Spanish format: 6|7|9XXXXXXXX)
- Education data validation
- Work experience validation
- CV/Resume validation

**Database Persistence (13 tests):**

- Candidate creation with minimal and complete data
- Related records creation (education, work experience, CV)
- Error handling (P2002 duplicate email, general errors)
- Data flow integration testing

All tests follow TDD best practices with AAA pattern, descriptive naming, proper TypeScript typing, and comprehensive Prisma mocking.
