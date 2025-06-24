# Prompts utilizados

He utilizado GitHub Copilot con GPT-4.1.

```
Act as a fullstack javascript developer expert in react, express and prisma. Can you tell me the items of the current stack that implements an "add candidate" feature #file:frontend and #file:backend
```

----

```
Ok, we need to add tests to the backend in a file backend/src/tests/tests-iniciales.test.ts. Before write any code, think about all possible test to write including edge cases and low probably things. Use mocks for database. Ask me any question you need before continue.
```

----

```
Required fields for candidate: firstName, lastName, email. Optional fields: phone, address, educations, workExperiences, resumes. Candidates with same e-mail should be rejected. No added business logic. The tests should cover as much code as possible: service, controller and routes. The test framework must be jest. Code must be written in TypeScript, so you will need ts-jest package
```

----

```
all tests for service, controller, and route must be in backend/src/tests/tests-ACC.test.ts. Use AAA for test code organization.
```

----

```
start coding
```

----

```
I get this error: FAIL src/tests/tests-ACC.test.ts [...]
```