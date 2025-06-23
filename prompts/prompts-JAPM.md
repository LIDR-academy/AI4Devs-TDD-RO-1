# Lista de Prompts Utilizadas

## 1. Solicitud de detalles del proyecto
> Hola Copilot. Dame los detalles del siguiente proyecto.

## 2. Recomendaciones para implementar Jest
> #file:backend Eres QA experto e implementación de pruebas unitarias. Me gustaría implementar "jest" en el proyecto adjunto. ¿que recomendaciones me puedas dar para poder iniciar?

## 3. Explicación del flujo para agregar un candidato
> #file:backend El proyecto con el que estamos trabajando es un gestor de candidatos para el area de recursos humanos. Actualmente estamos revisando la funcionalidad de agregar un candidato al sistema. ¿podrias decirme como el sistema realiza esta acción?

## 4. Generación de lista de pruebas para POST /candidates
> Vamos a implementar pruebas unitarias sobre "POST /candidates" antes generar código dame una lista de pruebas que podemos realizar sobre esta funcionalidad. Considera incluir pruebas positivas (Happy Paths) y pruebas negativas (Invalid Paths)

## 5. Propuesta de estructura de directorios para pruebas unitarias
> Ya tenemos una lista de pruebas para empezar con las pruebas. Antes de empezar dame una estructura de directorios para empezar a crear archivos y organizar las pruenbas unitarias de este proyecto.

## 6. Pasos y código para implementar pruebas unitarias seleccionadas
> Vamos a implementar pruebas unitarias sobre "POST /candidates", para ello vamos a seguir los siguientes requerimientos:
1. Genera un lista de pruebas a realizar, incluye pruebas validas (Happy Paths) y pruebas invalidas (Invalid Paths)
2. Aún no generes codigo, una vez que se tenga la lista se seleccionaran que pruebas vamos a realizar
3. Por cada prueba de la lista indica el archivo y la ruta donde se debería incluir.
¿hay algo que me este faltando considerar?
Realiza preguntas si te falta información para completar la tarea.

## 7. Instrucciones para ejecutar pruebas unitarias
> Vamos a implementar las siguientes pruebas unitaras: 1, 2, 4 y 5. Dime paso por paso que debemos hacer para implementarlas, así mismo incluye el código de las pruebadas designadas.

## 8. Solución de errores comunes en pruebas (dependencias, puertos, archivos)
> Obtenemos el siguiente error:
--- ERROR ---
λ npm test

> backend@1.0.0 test
> jest

 FAIL  __tests__/routes/candidateRoutes.test.ts
  ● Test suite failed to run
                                                                                           
    __tests__/routes/candidateRoutes.test.ts:1:21 - error TS2307: Cannot find module 'supertest' or its corresponding type declarations.

    1 import request from 'supertest';
                          ~~~~~~~~~~~

Test Suites: 1 failed, 1 total                                                             
Tests:       0 total                                                                       
Snapshots:   0 total
Time:        5.038 s
Ran all test suites.
--- FIN ERROR ---
¿como lo resolvemos?


## 9. Lista de pruebas para el método addCandidate
> Vamos a implementar pruebas unitarias sobre el metodo "addCandidate", para ello vamos a seguir los siguientes requerimientos:

1. Genera un lista de pruebas a realizar, incluye pruebas validas (Happy Paths) y pruebas invalidas (Invalid Paths)
2. Aún no generes codigo, una vez que se tenga la lista se seleccionaran que pruebas vamos a realizar
3. Por cada prueba de la lista indica el archivo y la ruta donde se debería incluir.
¿hay algo que me este faltando considerar?
Realiza preguntas si te falta información para completar la tarea.

## 10. Implementación de pruebas unitarias para addCandidate
> Vamos a implementar las siguientes pruebas unitaras: 2, 3, y 8 para el metodo "addCandidate". Sigue las siguientes instrucciones:
1. Indica los archivos que vamos a crear
2. Genera el código
Realiza preguntas si necesitas más información.

## 11. Propuesta para manejo de archivos en pruebas
> La prueba 2 incluye adjuntar un archivo en formato .pdf, genera una propuesta en la que sea lea este archivo de pruebas desde la carpeta de tests.

## 12. Solución de errores comunes en pruebas (dependencias, puertos, archivos)
> Tengo los siguientes errores al ejecuar el modulo de pruebas:
--- ERROR ---
 FAIL  __tests__/application/services/candidateService.test.ts
  ● Test suite failed to run

    __tests__/application/services/candidateService.test.ts:50:6 - error TS2352: Conversion of type 'typeof Candidate' to type 'Mock<any, any, any>' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
      Type 'typeof Candidate' is missing the following properties from type 'Mock<any, any, any>': getMockName, mock, mockClear, mockReset, and 13 more.

    50     (Candidate as jest.Mock).mockImplementation(() => ({
            ~~~~~~~~~~~~~~~~~~~~~~
    __tests__/application/services/candidateService.test.ts:90:6 - error TS2352: Conversion of type 'typeof Candidate' to type 'Mock<any, any, any>' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.

    90     (Candidate as jest.Mock).mockImplementation(() => ({
            ~~~~~~~~~~~~~~~~~~~~~~

Test Suites: 2 failed, 2 total
Tests:       1 failed, 3 passed, 4 total
Snapshots:   0 total
Time:        3.919 s
Ran all test suites.
--- FIN ERROR ---
¿como lo resolvemos?

## 13. Confirmación de uso de mocks en pruebas unitarias
> Se tiene el siguiente requerimiento:
--- REQUERIMIENTO ---
(BONUS) Aunque para esta sesión no es necesario, si alguno de los tests requiere modificar algo en base de datos, recuerda que lo ideal cuando las pruebas unitarias requieren interacción con base de datos, es mockearla para no alterar los datos
--- FIN REQUERIMIENTO ---
¿tenemos implementados mocks en los archivos de prueba?

## 14. Resumen de tareas realizadas
> Dame un resumen de las tareas realizadas hasta el momento

## 15. Conversión de resumen a formato .md
> Convierte el contenido del resumen en formato para archivos .md

## 16. Solicitud de lista de prompts utilizadas
> Dame la lista de promts utilizadas hasta el momento. Tus pautas para generar el contenido es en formato para archivos .md

## 17. Actualizar README.md
> En el archivo #file:README.md quiero incluir la información de la estructura de las carpetas de los archivos de pruebas unitarias y su ejecución. Tu tarea es complementar la información en la documentación adjunta. Tus pautas para generar el contenido es que me indiques en que linea del archivo incluyo la información y tomes en cuenta cada sección del documento.

## 18. Generar documentación para estructura de archivos de la carpeta __tests__
Dame la estructura de archivos de los archivos de test como en el siguiente ejemplo:
--- EJEMPLO ---
- `backend/`: It contains the server-side code written in Node.js.
  - `__test__`: It contains test units code files
  - `src/`: It contains the source code for the backend.
    - `index.ts`: The entry point for the backend server.
    - `application/`: It contains the application logic.
    - `domain/`: It contains the business logic.
    - `presentation/`: It contains code related to the presentation layer (such as controllers).
    - `routes/`: It contains the route definitions for the API.
  - `prisma/`: It contains the Prisma schema file for ORM.
  - `tsconfig.json`: TypeScript configuration file.
- `frontend/`: It contains the client-side code written in React.
  - `src/`: It contains the source code for the frontend.
  - `public/`: It contains static files such as the HTML file and images.
  - `build/`: It contains the production-ready build of the frontend.
- `.env`: It contains the environment variables.
- `docker-compose.yml`: It contains the Docker Compose configuration to manage your application's services.
- `README.md`: This file contains information about the project and instructions on how to run it.
--- FIN EJEMPLO ---
Tus pautas para generar el contenido son que generes una versión en español y otra en inglés.