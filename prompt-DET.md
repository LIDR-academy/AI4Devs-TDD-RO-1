# Rol
Eres un desarrollador de software experto en el ecosistema de Node.js y TypeScript.

# Misión
Tu tarea es instalar las dependencias de desarrollo necesarias para configurar un entorno de testing unitario con Jest en el backend de nuestro proyecto.

# Contexto del Proyecto
El proyecto tiene una estructura monorepo con un directorio `backend/`. Todas las siguientes operaciones deben realizarse dentro de ese directorio.

# Pasos
1.  Abre una terminal y navega al directorio del backend: `cd backend`.
2.  Una vez dentro de `backend/`, utiliza `npm` para instalar las siguientes dependencias en modo de desarrollo (`--save-dev` o `-D`):
    * `jest`
    * `ts-jest`
    * `@types/jest`

3.  Verifica que el archivo `backend/package.json` se ha actualizado con estas dependencias en la sección `devDependencies`.

============================
Rol
Eres un Ingeniero de Calidad de Software (QA) experto en testing de backend, con un profundo conocimiento de Prisma y Jest.

Misión
Tu tarea es establecer un mock reutilizable para el PrismaClient. [cite_start]El objetivo es reemplazar la instancia real de Prisma por una versión controlada en nuestros tests, permitiéndonos simular respuestas de la base de datos sin interactuar realmente con ella. [cite_start]Esto es crucial para crear tests unitarios aislados y eficientes.

Contexto del Proyecto
En nuestra aplicación, existe un cliente de Prisma que se exporta para ser usado en diferentes partes del código (probablemente desde un archivo como backend/src/infrastructure/db/prisma.ts). Vamos a interceptar esta instancia. Utilizaremos la librería jest-mock-extended que es ideal para mockear objetos complejos como el cliente de Prisma.

Pasos
Pregunta cualquier duda o necesidad que tengas para completar la tarea. Dime que vas a hacer antes de empezar a escribir código para que pueda validarlo.

Instalar la dependencia de desarrollo:
Abre tu terminal en el directorio backend/ y ejecuta el siguiente comando para instalar jest-mock-extended:

Crear el archivo del mock:
Dentro de backend/src/tests/, crea un nuevo archivo llamado _helpers/prisma_mock.ts. Este contendrá nuestro mock y podrá ser importado en cualquier archivo de test.

Implementar el mock:
backend/src/tests/_helpers/prisma_mock.ts.

Ajustar la configuración de Jest:
Para que Jest cargue este archivo de configuración (beforeEach) automáticamente antes de cada test, modifica backend/jest.config.js

=====================================
# Rol
Eres un Ingeniero de Software enfocado en la calidad y robustez de la lógica de negocio, escribiendo tests unitarios para la capa de aplicación.

# Misión
Escribir tests unitarios para el caso de uso o servicio responsable de crear un nuevo candidato. Estos tests deben verificar que la lógica de la aplicación interactúa correctamente con la capa de la base de datos (que ahora está mockeada) y maneja tanto los casos de éxito como los de error.

# Pasos

Pregunta todo lo que sea necesario para realizar los test.
Y di que test son necesarios para cubrir los test unitarios que son necesarios para este servicio


==============================================
DavidEstesoTorrecilla: # Rol
Eres un desarrollador backend escribiendo tests unitarios para la capa de presentación (controladores), asegurando que maneja correctamente las peticiones HTTP.

# Misión
Escribir tests unitarios para el controlador que gestiona la petición `POST /candidates`. Los tests deben verificar la validación de los datos de entrada y la correcta interacción con la capa de aplicación (que será mockeada), sin probar la lógica interna de esta última.
# Pasos
Pregunta todo lo que sea necesario par realizar los test. 
Y di que test son necesarios para cubrir los test unitarios que son nevesarios para gestionar la petición

