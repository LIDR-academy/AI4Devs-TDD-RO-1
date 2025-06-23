# GitHub Copilot Custom Instructions - LTI ATS Project

## Project Overview

This is a TypeScript-based ATS (Applicant Tracking System) with:

- **Backend**: Express.js + Prisma + PostgreSQL
- **Frontend**: React + TypeScript
- **Testing**: Jest + TypeScript
- **Architecture**: Clean Architecture (Domain, Application, Presentation layers)

## Code Style & Conventions

### TypeScript

- Use strict TypeScript with proper typing
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Follow camelCase for variables and functions, PascalCase for classes

### Testing Guidelines

- **Framework**: Jest with TypeScript
- **Pattern**: Follow AAA (Arrange-Act-Assert) pattern
- **Naming**: Use descriptive test names: `should [expected behavior] when [condition]`
- **Mocking**: Always mock external dependencies (Prisma, file system, etc.)
- **Structure**: Group related tests in `describe` blocks
- **Isolation**: Each test should be independent and not rely on others

### File Organization

- Tests in `backend/src/tests/` with `.test.ts` extension
- Services in `backend/src/application/services/`
- Domain models in `backend/src/domain/models/`
- Validation logic in `backend/src/application/validator.ts`

## Database & Prisma

- Use Prisma Client for database operations
- Always mock Prisma in unit tests: `jest.mock('@prisma/client')`
- Handle Prisma errors properly (e.g., P2002 for unique constraints)

## Validation Rules

- Names: 2-100 characters, alphabetic + Spanish accents
- Email: Standard email format validation
- Phone: Spanish format (6|7|9)XXXXXXXX
- Dates: YYYY-MM-DD format

## Testing Priorities

1. **Validation Tests**: Test all input validation scenarios
2. **Business Logic**: Test core functionality with mocked dependencies
3. **Error Handling**: Test error scenarios and edge cases
4. **Integration Points**: Mock external services appropriately

## Candidate Model Structure

```typescript
{
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  educations?: Education[];
  workExperiences?: WorkExperience[];
  cv?: Resume;
}
```

## Common Patterns

### Test Setup

```typescript
import { addCandidate } from "../application/services/candidateService";
import { PrismaClient } from "@prisma/client";

jest.mock("@prisma/client");

describe("Service Name", () => {
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });
});
```

### Mock Setup

```typescript
const mockPrisma = {
  candidate: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
} as any;
```

## When Generating Code

1. Always include proper TypeScript types
2. Create meaningful test scenarios covering both success and failure cases
3. Use realistic test data that matches domain constraints
4. Include proper error handling tests
5. Mock all external dependencies
6. Follow the existing project structure and naming conventions

## Focus Areas for This Project

- Unit testing for candidate insertion functionality
- Validation logic testing
- Prisma mocking and database interaction testing
- Error handling for duplicate emails and validation failures
- Clean, maintainable test code following TDD principles
