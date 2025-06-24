/**
 * Ejemplo de test unitario básico
 */

describe('Configuración de test básica', () => {
  it('debería funcionar la suma correctamente', () => {
    expect(1 + 1).toBe(2);
  });

  it('debería funcionar correctamente con valores booleanos', () => {
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
  });
});
