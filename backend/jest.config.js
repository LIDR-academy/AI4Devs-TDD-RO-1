const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/src/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // Transformar archivos .ts y .tsx con ts-jest
  },
  moduleNameMapper: {
    // Mapeo para @prisma/client al mock global
    "@prisma/client": "<rootDir>/src/tests/__mocks__/@prisma/client.ts",
    // Mapeo exacto para el módulo Candidate (si se usa de forma absoluta)
    "^domain\/models\/Candidate$": "<rootDir>/src/domain/models/Candidate.ts",
    // Mapeo para otros imports absolutos basados en baseUrl (desde src)
    "^application\/services\/(.*)$": "<rootDir>/src/application/services/$1",
    "^application\/validator$": "<rootDir>/src/application/validator.ts",
  },
};