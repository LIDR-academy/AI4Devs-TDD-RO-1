# LTI - Talent Tracking System | ENG

This project is a full-stack application with a React frontend and an Express backend using Prisma as an ORM. The frontend is set up with Create React App, and the backend is written in TypeScript.

## Prerequisites

Before starting, make sure you have the following installed:

- **Node.js**: Version 16.13 or higher (recommended: 18.x LTS)
- **npm**: Usually comes with Node.js
- **Docker**: For running PostgreSQL database
- **Git**: For cloning the repository

### Node.js Version Requirements

This project requires **Node.js >= 16.13** due to Prisma compatibility. If you encounter errors like:
```
Prisma only supports Node.js >= 16.13
Please upgrade your Node.js version
```

**Solution**: Install Node Version Manager (nvm) and use Node.js 18:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell or run:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install and use Node.js 18
nvm install 18
nvm use 18

# Set as default (optional)
nvm alias default 18
```

## Explanation of Directories and Files

- `backend/`: It contains the server-side code written in Node.js.
  - `src/`: It contains the source code for the backend.
    - `index.ts`: The entry point for the backend server.
    - `application/`: It contains the application logic.
    - `domain/`: It contains the business logic.
    - `presentation/`: It contains code related to the presentation layer (such as controllers).
    - `routes/`: It contains the route definitions for the API.
    - `__tests__/`: It contains the test files (unit, integration, and e2e tests).
  - `prisma/`: It contains the Prisma schema file for ORM.
  - `tsconfig.json`: TypeScript configuration file (configured for ES2020).
  - `jest.config.js`: Jest configuration for testing.
- `frontend/`: It contains the client-side code written in React.
  - `src/`: It contains the source code for the frontend.
  - `public/`: It contains static files such as the HTML file and images.
  - `build/`: It contains the production-ready build of the frontend.
  - `__tests__/`: It contains the test files for React components.
  - `jest.config.js`: Jest configuration for React testing.
- `scripts/`: Contains utility scripts for the project.
  - `generate-test-reports.js`: Script to generate consolidated test reports.
- `test-reports/`: Contains generated test reports and dashboards.
  - `current/`: Current test reports and dashboard.
  - `history/`: Historical test reports with timestamps.
- `.env`: It contains the environment variables.
- `docker-compose.yml`: It contains the Docker Compose configuration to manage your application's services.
- `README.md`: This file contains information about the project and instructions on how to run it.
- `prompts.md`: Documentation of all prompts and development process.

## Project Structure

The project is divided into two main directories: frontend and backend.

### Frontend

The frontend is a React application, and its main files are located in the src folder. The public folder contains static assets, and the build directory contains the production build of the application.

### Backend

The backend is an Express application written in TypeScript. The src directory contains the source code, divided into several subdirectories:

- `application`: It contains the application logic.
- `domain`: It contains the domain models.
- `infrastructure`: It contains code related to the infrastructure.
- `presentation`: It contains code related to the presentation layer.
- `routes`: It contains the application routes.
- `__tests__`: It contains the application tests (unit, integration, e2e).

The `prisma` folder contains the Prisma schema.

## First Steps

To get started with this project, follow these steps:

### 1. Clone the repository
```bash
git clone <repository-url>
cd AI4Devs-TDD-RO-1
```

### 2. Verify Node.js version
```bash
node --version  # Should be >= 16.13
```

### 3. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Set up the database
```bash
# Start PostgreSQL with Docker
cd ..  # Go back to root directory
docker-compose up -d

# Generate Prisma client and run migrations
cd backend
npx prisma generate
npx prisma migrate dev
```

### 5. Build and start the backend
```bash
cd backend
npm run build
npm start
```

The backend server will be running at http://localhost:3010.

### 6. Start the frontend (in a new terminal)
```bash
cd frontend
npm start
```

The frontend will be available at http://localhost:3000.

## Testing

This project includes a comprehensive testing setup with unit tests, integration tests, and visual test reports.

### Running Tests

#### Backend Tests
```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
npm run test:coverage:report # Generate detailed coverage report
npm run test:ci           # Run tests for CI/CD
```

#### Frontend Tests
```bash
cd frontend
npm test                   # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
npm run test:coverage:report # Generate detailed coverage report
npm run test:ci          # Run tests for CI/CD
```

#### Consolidated Test Reports
```bash
# From the root directory
npm run test:all          # Run all tests (backend + frontend)
npm run test:reports      # Generate consolidated test reports
npm run test:reports:view # Generate reports and start web server
npm run test:coverage     # Run all tests and generate reports
npm run test:coverage:view # Run tests, generate reports, and start server
```

### Test Coverage

The project includes comprehensive test coverage reporting:

- **Backend**: Unit tests for services, integration tests for routes
- **Frontend**: Component tests using React Testing Library
- **Coverage Reports**: HTML, JSON, LCOV, and XML formats
- **Visual Dashboards**: Interactive charts and statistics

### Viewing Test Reports

1. **Start the web server**:
```bash
python3 -m http.server 8080
```

2. **Access the reports**:
- **Main Dashboard**: http://localhost:8080/test-reports/current/dashboard.html
- **Simple Dashboard**: http://localhost:8080/test-reports-dashboard.html
- **Backend Coverage**: http://localhost:8080/backend/coverage/index.html
- **Frontend Coverage**: http://localhost:8080/frontend/coverage/index.html

### Test Structure

```
backend/src/__tests__/
├── unit/
│   └── services/
│       └── candidateService.test.ts
├── integration/
│   └── candidateRoutes.test.ts
└── e2e/
    └── candidateE2E.test.ts

frontend/src/__tests__/
├── unit/
│   └── components/
│       └── AddCandidateForm.test.tsx
└── integration/
```

## Troubleshooting

### Common Issues

1. **Node.js version error**: Make sure you're using Node.js >= 16.13
2. **Prisma client generation error**: Run `npx prisma generate` in the backend directory
3. **TypeScript compilation error**: The project is configured for ES2020, ensure your Node.js version supports it
4. **Database connection error**: Make sure Docker is running and PostgreSQL container is up
5. **Test coverage threshold error**: Coverage thresholds are set to 5% for development, increase as you add more tests

### TypeScript Configuration

The project uses TypeScript with the following configuration:
- **Target**: ES2020 (compatible with Node.js 18+)
- **Module**: CommonJS
- **Strict mode**: Enabled
- **Source maps**: Enabled for debugging

## Docker and PostgreSQL

This project uses Docker to run a PostgreSQL database. Here's how to get it up and running:

1. Install Docker on your machine if you haven't done so already. You can download it from [Docker's official website](https://www.docker.com/products/docker-desktop).

2. Navigate to the root directory of the project in your terminal.

3. Run the following command to start the Docker container:
```bash
docker-compose up -d
```

This will start a PostgreSQL database in a Docker container. The `-d` flag runs the container in detached mode, which means it runs in the background.

### Database Connection Details

To access the PostgreSQL database, you can use any PostgreSQL client with the following connection details:
- **Host**: localhost
- **Port**: 5432
- **User**: postgres
- **Password**: password
- **Database**: mydatabase

Please replace User, Password, and Database with the actual username, password, and database name specified in your `.env` file.

### Database Management

To stop the Docker container:
```bash
docker-compose down
```

To view database logs:
```bash
docker-compose logs postgres
```

To reset the database:
```bash
docker-compose down -v
docker-compose up -d
```

## Prisma Database Setup

To generate the database using Prisma, follow these steps:

1. Make sure that the `.env` file in the backend directory contains the `DATABASE_URL` variable with the correct connection string to your PostgreSQL database. If it doesn't work, try replacing the full URL directly in `schema.prisma`, in the `url` variable.

2. Open a terminal and navigate to the backend directory where the `schema.prisma` file is located.

3. Run the following command to apply the migrations to your database:
```bash
npx prisma migrate dev
```

4. Generate the Prisma client:
```bash
npx prisma generate
```

5. (Optional) Open Prisma Studio to view and edit your data:
```bash
npx prisma studio
```

## API Testing

Once you have completed all the steps, you should be able to save new candidates, both via the web and via the API, and see them in the database.

### Example API Request

```bash
POST http://localhost:3010/candidates
Content-Type: application/json

{
    "firstName": "Albert",
    "lastName": "Saelices",
    "email": "albert.saelices@gmail.com",
    "phone": "656874937",
    "address": "Calle Sant Dalmir 2, 5ºB. Barcelona",
    "educations": [
        {
            "institution": "UC3M",
            "title": "Computer Science",
            "startDate": "2006-12-31",
            "endDate": "2010-12-26"
        }
    ],
    "workExperiences": [
        {
            "company": "Coca Cola",
            "position": "SWE",
            "description": "",
            "startDate": "2011-01-13",
            "endDate": "2013-01-17"
        }
    ],
    "cv": {
        "filePath": "uploads/1715760936750-cv.pdf",
        "fileType": "application/pdf"
    }
}
```

## Development Scripts

### Root Level Scripts
```bash
npm run test:all          # Run all tests (backend + frontend)
npm run test:backend      # Run backend tests with coverage
npm run test:frontend     # Run frontend tests with coverage
npm run test:reports      # Generate consolidated test reports
npm run test:reports:view # Generate reports and start web server
npm run test:coverage     # Run all tests and generate reports
npm run test:coverage:view # Run tests, generate reports, and start server
```

### Backend Scripts
```bash
cd backend
npm run build             # Build TypeScript to JavaScript
npm start                 # Start the production server
npm run dev               # Start in development mode
npm test                  # Run tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage
npm run test:coverage:report # Generate detailed coverage report
npm run test:ci          # Run tests for CI/CD
```

### Frontend Scripts
```bash
cd frontend
npm start                 # Start development server
npm run build             # Build for production
npm test                  # Run tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage
npm run test:coverage:report # Generate detailed coverage report
npm run test:ci          # Run tests for CI/CD
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes using the testing commands above
5. Ensure test coverage meets the project standards
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

-------------------------------------------------------------

# LTI - Sistema de Seguimiento de Talento | ES

Este proyecto es una aplicación full-stack con un frontend en React y un backend en Express usando Prisma como un ORM. El frontend se inicia con Create React App y el backend está escrito en TypeScript.

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: Versión 16.13 o superior (recomendado: 18.x LTS)
- **npm**: Normalmente viene con Node.js
- **Docker**: Para ejecutar la base de datos PostgreSQL
- **Git**: Para clonar el repositorio

### Requisitos de Versión de Node.js

Este proyecto requiere **Node.js >= 16.13** debido a la compatibilidad con Prisma. Si encuentras errores como:
```
Prisma only supports Node.js >= 16.13
Please upgrade your Node.js version
```

**Solución**: Instala Node Version Manager (nvm) y usa Node.js 18:

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recargar shell o ejecutar:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Instalar y usar Node.js 18
nvm install 18
nvm use 18

# Establecer como predeterminado (opcional)
nvm alias default 18
```

## Explicación de Directorios y Archivos

- `backend/`: Contiene el código del lado del servidor escrito en Node.js.
  - `src/`: Contiene el código fuente para el backend.
    - `index.ts`: El punto de entrada para el servidor backend.
    - `application/`: Contiene la lógica de aplicación.
    - `domain/`: Contiene la lógica de negocio.
    - `presentation/`: Contiene código relacionado con la capa de presentación (como controladores).
    - `routes/`: Contiene las definiciones de rutas para la API.
    - `__tests__/`: Contiene los archivos de pruebas (unitarias, integración y e2e).
  - `prisma/`: Contiene el archivo de esquema de Prisma para ORM.
  - `tsconfig.json`: Archivo de configuración de TypeScript (configurado para ES2020).
  - `jest.config.js`: Configuración de Jest para pruebas.
- `frontend/`: Contiene el código del lado del cliente escrito en React.
  - `src/`: Contiene el código fuente para el frontend.
  - `public/`: Contiene archivos estáticos como el archivo HTML e imágenes.
  - `build/`: Contiene la construcción lista para producción del frontend.
  - `__tests__/`: Contiene los archivos de pruebas para componentes React.
  - `jest.config.js`: Configuración de Jest para pruebas de React.
- `scripts/`: Contiene scripts de utilidad para el proyecto.
  - `generate-test-reports.js`: Script para generar reportes consolidados de pruebas.
- `test-reports/`: Contiene reportes de pruebas generados y dashboards.
  - `current/`: Reportes de pruebas actuales y dashboard.
  - `history/`: Reportes históricos de pruebas con timestamps.
- `.env`: Contiene las variables de entorno.
- `docker-compose.yml`: Contiene la configuración de Docker Compose para gestionar los servicios de tu aplicación.
- `README.md`: Este archivo, contiene información sobre el proyecto e instrucciones sobre cómo ejecutarlo.
- `prompts.md`: Documentación de todos los prompts y proceso de desarrollo.

## Estructura del Proyecto

El proyecto está dividido en dos directorios principales: `frontend` y `backend`.

### Frontend

El frontend es una aplicación React y sus archivos principales están ubicados en el directorio `src`. El directorio `public` contiene activos estáticos y el directorio `build` contiene la construcción de producción de la aplicación.

### Backend

El backend es una aplicación Express escrita en TypeScript. El directorio `src` contiene el código fuente, dividido en varios subdirectorios:

- `application`: Contiene la lógica de aplicación.
- `domain`: Contiene los modelos de dominio.
- `infrastructure`: Contiene código relacionado con la infraestructura.
- `presentation`: Contiene código relacionado con la capa de presentación.
- `routes`: Contiene las rutas de la aplicación.
- `__tests__`: Contiene las pruebas de la aplicación (unitarias, integración, e2e).

El directorio `prisma` contiene el esquema de Prisma.

## Primeros Pasos

Para comenzar con este proyecto, sigue estos pasos:

### 1. Clona el repositorio
```bash
git clone <url-del-repositorio>
cd AI4Devs-TDD-RO-1
```

### 2. Verifica la versión de Node.js
```bash
node --version  # Debe ser >= 16.13
```

### 3. Instala las dependencias
```bash
# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 4. Configura la base de datos
```bash
# Iniciar PostgreSQL con Docker
cd ..  # Volver al directorio raíz
docker-compose up -d

# Generar cliente Prisma y ejecutar migraciones
cd backend
npx prisma generate
npx prisma migrate dev
```

### 5. Construye e inicia el backend
```bash
cd backend
npm run build
npm start
```

El servidor backend estará corriendo en http://localhost:3010.

### 6. Inicia el frontend (en una nueva terminal)
```bash
cd frontend
npm start
```

El frontend estará disponible en http://localhost:3000.

## Pruebas

Este proyecto incluye una configuración completa de pruebas con tests unitarios, de integración y reportes visuales de pruebas.

### Ejecutar Pruebas

#### Pruebas del Backend
```bash
cd backend
npm test                    # Ejecutar todas las pruebas
npm run test:watch         # Ejecutar pruebas en modo observación
npm run test:coverage      # Ejecutar pruebas con reporte de cobertura
npm run test:coverage:report # Generar reporte detallado de cobertura
npm run test:ci           # Ejecutar pruebas para CI/CD
```

#### Pruebas del Frontend
```bash
cd frontend
npm test                   # Ejecutar todas las pruebas
npm run test:watch        # Ejecutar pruebas en modo observación
npm run test:coverage     # Ejecutar pruebas con reporte de cobertura
npm run test:coverage:report # Generar reporte detallado de cobertura
npm run test:ci          # Ejecutar pruebas para CI/CD
```

#### Reportes Consolidados de Pruebas
```bash
# Desde el directorio raíz
npm run test:all          # Ejecutar todas las pruebas (backend + frontend)
npm run test:reports      # Generar reportes consolidados de pruebas
npm run test:reports:view # Generar reportes e iniciar servidor web
npm run test:coverage     # Ejecutar todas las pruebas y generar reportes
npm run test:coverage:view # Ejecutar pruebas, generar reportes e iniciar servidor
```

### Cobertura de Pruebas

El proyecto incluye reportes completos de cobertura de pruebas:

- **Backend**: Tests unitarios para servicios, tests de integración para rutas
- **Frontend**: Tests de componentes usando React Testing Library
- **Reportes de Cobertura**: Formatos HTML, JSON, LCOV y XML
- **Dashboards Visuales**: Gráficos interactivos y estadísticas

### Ver Reportes de Pruebas

1. **Iniciar el servidor web**:
```bash
python3 -m http.server 8080
```

2. **Acceder a los reportes**:
- **Dashboard Principal**: http://localhost:8080/test-reports/current/dashboard.html
- **Dashboard Simplificado**: http://localhost:8080/test-reports-dashboard.html
- **Cobertura Backend**: http://localhost:8080/backend/coverage/index.html
- **Cobertura Frontend**: http://localhost:8080/frontend/coverage/index.html

### Estructura de Pruebas

```
backend/src/__tests__/
├── unit/
│   └── services/
│       └── candidateService.test.ts
├── integration/
│   └── candidateRoutes.test.ts
└── e2e/
    └── candidateE2E.test.ts

frontend/src/__tests__/
├── unit/
│   └── components/
│       └── AddCandidateForm.test.tsx
└── integration/
```

## Solución de Problemas

### Problemas Comunes

1. **Error de versión de Node.js**: Asegúrate de usar Node.js >= 16.13
2. **Error de generación del cliente Prisma**: Ejecuta `npx prisma generate` en el directorio backend
3. **Error de compilación de TypeScript**: El proyecto está configurado para ES2020, asegúrate de que tu versión de Node.js lo soporte
4. **Error de conexión a la base de datos**: Asegúrate de que Docker esté ejecutándose y el contenedor PostgreSQL esté activo
5. **Error de umbral de cobertura**: Los umbrales de cobertura están configurados al 5% para desarrollo, aumenta conforme agregues más pruebas

### Configuración de TypeScript

El proyecto usa TypeScript con la siguiente configuración:
- **Target**: ES2020 (compatible con Node.js 18+)
- **Module**: CommonJS
- **Strict mode**: Habilitado
- **Source maps**: Habilitado para debugging

## Docker y PostgreSQL

Este proyecto usa Docker para ejecutar una base de datos PostgreSQL. Así es cómo ponerlo en marcha:

1. Instala Docker en tu máquina si aún no lo has hecho. Puedes descargarlo desde [la página oficial de Docker](https://www.docker.com/products/docker-desktop).

2. Navega al directorio raíz del proyecto en tu terminal.

3. Ejecuta el siguiente comando para iniciar el contenedor Docker:
```bash
docker-compose up -d
```

Esto iniciará una base de datos PostgreSQL en un contenedor Docker. La bandera `-d` corre el contenedor en modo separado, lo que significa que se ejecuta en segundo plano.

### Detalles de Conexión a la Base de Datos

Para acceder a la base de datos PostgreSQL, puedes usar cualquier cliente PostgreSQL con los siguientes detalles de conexión:
- **Host**: localhost
- **Port**: 5432
- **User**: postgres
- **Password**: password
- **Database**: mydatabase

Por favor, reemplaza User, Password y Database con el usuario, la contraseña y el nombre de la base de datos reales especificados en tu archivo `.env`.

### Gestión de la Base de Datos

Para detener el contenedor Docker:
```bash
docker-compose down
```

Para ver los logs de la base de datos:
```bash
docker-compose logs postgres
```

Para resetear la base de datos:
```bash
docker-compose down -v
docker-compose up -d
```

## Configuración de la Base de Datos con Prisma

Para generar la base de datos utilizando Prisma, sigue estos pasos:

1. Asegúrate de que el archivo `.env` en el directorio backend contenga la variable `DATABASE_URL` con la cadena de conexión correcta a tu base de datos PostgreSQL. Si no te funciona, prueba a reemplazar la URL completa directamente en `schema.prisma`, en la variable `url`.

2. Abre una terminal y navega al directorio del backend donde se encuentra el archivo `schema.prisma`.

3. Ejecuta el siguiente comando para aplicar las migraciones a tu base de datos:
```bash
npx prisma migrate dev
```

4. Genera el cliente de Prisma:
```bash
npx prisma generate
```

5. (Opcional) Abre Prisma Studio para ver y editar tus datos:
```bash
npx prisma studio
```

## Pruebas de la API

Una vez has dado todos los pasos, deberías poder guardar nuevos candidatos, tanto via web, como via API, y verlos en la base de datos.

### Ejemplo de Petición API

```bash
POST http://localhost:3010/candidates
Content-Type: application/json

{
    "firstName": "Albert",
    "lastName": "Saelices",
    "email": "albert.saelices@gmail.com",
    "phone": "656874937",
    "address": "Calle Sant Dalmir 2, 5ºB. Barcelona",
    "educations": [
        {
            "institution": "UC3M",
            "title": "Computer Science",
            "startDate": "2006-12-31",
            "endDate": "2010-12-26"
        }
    ],
    "workExperiences": [
        {
            "company": "Coca Cola",
            "position": "SWE",
            "description": "",
            "startDate": "2011-01-13",
            "endDate": "2013-01-17"
        }
    ],
    "cv": {
        "filePath": "uploads/1715760936750-cv.pdf",
        "fileType": "application/pdf"
    }
}
```

## Scripts de Desarrollo

### Scripts del Nivel Raíz
```bash
npm run test:all          # Ejecutar todas las pruebas (backend + frontend)
npm run test:backend      # Ejecutar pruebas del backend con cobertura
npm run test:frontend     # Ejecutar pruebas del frontend con cobertura
npm run test:reports      # Generar reportes consolidados de pruebas
npm run test:reports:view # Generar reportes e iniciar servidor web
npm run test:coverage     # Ejecutar todas las pruebas y generar reportes
npm run test:coverage:view # Ejecutar pruebas, generar reportes e iniciar servidor
```

### Scripts del Backend
```bash
cd backend
npm run build             # Construir TypeScript a JavaScript
npm start                 # Iniciar el servidor de producción
npm run dev               # Iniciar en modo desarrollo
npm test                  # Ejecutar pruebas
npm run test:watch        # Ejecutar pruebas en modo observación
npm run test:coverage     # Ejecutar pruebas con cobertura
npm run test:coverage:report # Generar reporte detallado de cobertura
npm run test:ci          # Ejecutar pruebas para CI/CD
```

### Scripts del Frontend
```bash
cd frontend
npm start                 # Iniciar servidor de desarrollo
npm run build             # Construir para producción
npm test                  # Ejecutar pruebas
npm run test:watch        # Ejecutar pruebas en modo observación
npm run test:coverage     # Ejecutar pruebas con cobertura
npm run test:coverage:report # Generar reporte detallado de cobertura
npm run test:ci          # Ejecutar pruebas para CI/CD
```

## Contribución

1. Haz fork del repositorio
2. Crea una rama para tu funcionalidad
3. Realiza tus cambios
4. Prueba tus cambios usando los comandos de prueba anteriores
5. Asegúrate de que la cobertura de pruebas cumpla con los estándares del proyecto
6. Envía un pull request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

