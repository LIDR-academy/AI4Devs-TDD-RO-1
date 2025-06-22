# Prompts Used with GitHub Copilot - LTI ATS Unit Tests (GG)

## Project: LTI ATS - Jest Unit Test Suite for Candidate Insertion

### Task: Create comprehensive Jest unit tests for candidate insertion functionality covering form data validation and database persistence with mocked Prisma.

---

## Prompt 1: Initial Test File Creation

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Creating the main test file for candidate service testing

**Prompt:**

```
// Create comprehensive Jest unit tests for candidateService.ts addCandidate function
// Requirements:
// 1. Test both form data validation and database persistence
// 2. Use TypeScript with strong typing
// 3. Mock Prisma Client and domain models
// 4. Follow TDD best practices with AAA pattern
// 5. Cover all validation scenarios (required fields, formats, etc.)
// 6. Test database operations with proper mocking
// 7. Handle error scenarios (duplicates, validation failures)

import { addCandidate } from '../application/services/candidateService';
import { PrismaClient } from '@prisma/client';
```

---

## Prompt 2: Mock Setup and Test Structure

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Setting up proper mocks for Prisma and domain models

**Prompt:**

```
// Setup Jest mocks for Prisma Client and all domain models
// Create mock implementations that simulate real database behavior
// Include proper TypeScript types and mock cleanup in beforeEach

jest.mock('@prisma/client');
jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');

describe('addCandidate Service', () => {
  // Setup mocked types and implementations
  // Create realistic mock data that matches domain constraints
  // Ensure proper mock cleanup for test isolation
```

---

## Prompt 3: Validation Tests - Required Fields

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Creating validation tests for required fields

**Prompt:**

```
// Create comprehensive validation tests for required fields (firstName, lastName, email)
// Test scenarios:
// - Missing firstName should throw error
// - Empty firstName should throw error
// - Missing lastName should throw error
// - Missing email should throw error
// Follow AAA pattern: Arrange-Act-Assert
// Use descriptive test names with "should [expected behavior] when [condition]"

describe('Payload Validation Tests - Form Data Reception', () => {
  describe('Required Fields Validation', () => {
    it('should throw error when firstName is missing', async () => {
```

---

## Prompt 4: Validation Tests - Name Format

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Creating validation tests for name format rules

**Prompt:**

```
// Create validation tests for name format rules:
// - Names must be 2-100 characters
// - Only alphabetic characters and Spanish accents allowed
// - Test both firstName and lastName validation
// Include positive test for Spanish accents (José, María, González-Pérez)

describe('Name Validation', () => {
  it('should throw error when firstName is too short', async () => {
  it('should throw error when firstName is too long', async () => {
  it('should throw error when firstName contains invalid characters', async () => {
  it('should accept names with Spanish accents', async () => {
```

---

## Prompt 5: Email and Phone Validation Tests

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Creating validation tests for email and phone formats

**Prompt:**

```
// Create email validation tests:
// - Invalid email format should throw error
// - Missing @ symbol should throw error
// - Missing domain should throw error
// - Valid email should pass

// Create phone validation tests for Spanish format:
// - Phone must start with 6, 7, or 9
// - Must be exactly 9 digits
// - Invalid format should throw error
// - Phone is optional field

describe('Email Validation', () => {
describe('Phone Validation', () => {
```

---

## Prompt 6: Complex Data Validation Tests

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Creating validation tests for education, work experience, and CV data

**Prompt:**

```
// Create validation tests for complex nested data:
// Education validation:
// - institution is required
// - title is required
// - startDate must be valid YYYY-MM-DD format

// Work Experience validation:
// - company is required
// - position is required

// CV validation:
// - filePath is required when CV provided
// - fileType is required when CV provided

describe('Education Validation', () => {
describe('Work Experience Validation', () => {
describe('CV Validation', () => {
```

---

## Prompt 7: Database Persistence Tests

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Creating database persistence tests with Prisma mocks

**Prompt:**

```
// Create database persistence tests with proper Prisma mocking:
// Test successful candidate creation with minimal data
// Test successful candidate creation with complete data including optional fields
// Mock Prisma client methods (create, findUnique, etc.)
// Verify correct data is passed to Prisma methods
// Test that function returns expected result structure

describe('Database Persistence Tests - Database Saving', () => {
  describe('Successful Candidate Creation', () => {
    it('should create candidate with minimal valid data', async () => {
    it('should create candidate with complete data including optional fields', async () => {
```

---

## Prompt 8: Related Records and Error Handling

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Testing creation of related records and error scenarios

**Prompt:**

```
// Create tests for related records creation:
// - Education records should be created and associated with candidate
// - Work experience records should be created and associated with candidate
// - CV/Resume records should be created and associated with candidate
// - Handle empty arrays gracefully

// Create error handling tests:
// - P2002 duplicate email error from Prisma
// - General database errors should be propagated
// - Validation errors should be properly handled

describe('Education Records Creation', () => {
describe('Work Experience Records Creation', () => {
describe('CV File Handling', () => {
describe('Error Handling', () => {
```

---

## Prompt 9: Jest Configuration Setup

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Setting up Jest configuration for TypeScript

**Prompt:**

```
// Create jest.config.js for TypeScript project with ts-jest
// Requirements:
// - Use ts-jest preset for TypeScript compilation
// - Set test environment to 'node' for backend testing
// - Configure proper test file patterns (**/*.test.ts)
// - Set up module resolution for TypeScript
// - Include coverage collection configuration

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Add remaining configuration for TypeScript support
```

---

## Prompt 10: Final Integration and Data Flow Test

**Date:** 22 June 2025  
**Tool:** GitHub Copilot  
**Context:** Creating comprehensive integration test

**Prompt:**

```
// Create comprehensive integration test that validates complete data flow:
// - Accept valid candidate data with all fields
// - Verify validation passes correctly
// - Verify Prisma methods are called with correct data
// - Verify all related records are created
// - Verify function returns expected result
// This test should validate the entire "insert candidate" workflow

describe('Data Flow Integration', () => {
  it('should pass validated data correctly through the entire flow', async () => {
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
