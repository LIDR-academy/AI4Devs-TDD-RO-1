# Testing con Jest

Este proyecto está configurado para ejecutar tests unitarios usando Jest con soporte para TypeScript.

## Configuración

- **Framework**: Jest
- **TypeScript**: ts-jest para testing directo de archivos .ts
- **Ubicación de tests**: `src/tests/tests-DCGC.test.ts`

## Comandos disponibles

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests en modo watch (desarrollo)
```bash
npm run test:watch
```

## Estructura de tests

Todos los tests deben estar en el archivo:
```
src/tests/tests-DCGC.test.ts
```

## Ejemplos de tests

### Test básico
```typescript
describe('Mi Suite de Tests', () => {
  test('debería hacer algo específico', () => {
    expect(1 + 1).toBe(2);
  });
});
```

### Test con TypeScript
```typescript
test('debería poder usar TypeScript', () => {
  const sum = (a: number, b: number): number => a + b;
  expect(sum(5, 3)).toBe(8);
});
```

### Test de importación de módulos
```typescript
test('debería poder importar servicios', () => {
  expect(() => {
    require('../application/services/candidateService');
  }).not.toThrow();
});
```

## Configuración de Jest

La configuración se encuentra en `jest.config.js` e incluye:
- Preset de ts-jest para TypeScript
- Entorno Node.js
- Patrones de archivos de test
- Timeout de 10 segundos por test

## Próximos pasos

1. Agregar tests para los servicios existentes
2. Implementar tests para los controladores
3. Agregar tests para validaciones
4. Implementar mocks para dependencias externas 