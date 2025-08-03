Trabajo se realizará con Visual Studio Code con Github Copilot

# Promt 1

# Rol
Actua como un experto en pruebas unitarias con prisma

# Objetivo de la tarea
* Analiza el proyecto en backend y encuentra la funcionalidad de insertar candidatos en la base de datos
* Realiza las pruebas unitarias para esta funcionalidad
* Debe realizarse tres pruebas unitarias que cubran la recepción de los datos del formulario
* Debe realizarse tres pruebas unitarias que cubran el guardado de los datos en la base de datos
* Considera que para las pruebas unitarias no debe realizarse modificaciones en la base de datos, por lo que en el momento del guardado debe hacer "mock" de ORM prisma
* Analiza los antecedentes y encuentra acciones que sean necesarias agregar y que no haya considerado para cumplir la tarea.

# Consideraciones
* Jest ya está configurado en el proyecto

# Acciones esperadas en la resolución
* Elaborar plan de acción para resolver la tarea
* Confirmar que acepte el plan propuesto antes de hacer algun cambio
* Ejecutar paso a paso el plan de acción

# Respuesta 1
Aquí tienes el plan de acción propuesto para cumplir con la tarea de pruebas unitarias sobre la funcionalidad de insertar candidatos en el backend usando Prisma y Jest:

Plan de Acción
1. Análisis y localización de la funcionalidad
Buscar el servicio y/o controlador responsable de insertar candidatos en la base de datos (probablemente en src/application/services/candidateService.ts y/o src/presentation/controllers/candidateController.ts).
2. Preparación para pruebas unitarias
Identificar la función que recibe los datos del formulario y la que realiza el guardado en la base de datos.
Revisar cómo se utiliza Prisma en el servicio para poder hacer el mock correctamente.
3. Pruebas unitarias de recepción de datos
Crear tres pruebas unitarias que validen la correcta recepción y procesamiento de los datos del formulario (por ejemplo: datos válidos, datos incompletos, datos con formato incorrecto).
4. Pruebas unitarias de guardado en base de datos
Crear tres pruebas unitarias que validen el guardado de los datos usando Prisma, pero haciendo mock del ORM para no modificar la base real (por ejemplo: guardado exitoso, error de guardado, validación de los datos enviados a Prisma).
5. Mock de Prisma
Configurar el mock de Prisma en los tests para interceptar las llamadas y simular respuestas.
6. Acciones adicionales necesarias
Verificar si existen dependencias o utilidades adicionales que deban ser mockeadas (por ejemplo, validadores).
Confirmar la estructura de los modelos y servicios para asegurar que los tests cubren los casos relevantes.
Crear los archivos de prueba en la ubicación adecuada (src/application/services/__tests__/candidateService.test.ts).
¿Aceptas este plan de acción o deseas agregar/modificar algún punto antes de continuar con la ejecución paso a paso?