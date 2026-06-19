# Gestor de Proyectos

Sistema web Full Stack para la gestión interna de proyectos y tareas de una startup, con frontend en React y backend en Express. MySQL almacena usuarios, proyectos y tareas; MongoDB registra el historial de cambios de cada tarea.

## Objetivo general

Centralizar el control operativo de proyectos y tareas en una interfaz administrativa clara, con filtros, dashboard, CRUD completo y trazabilidad histórica de cambios.

## Funcionalidades

- Dashboard con métricas generales.
- CRUD de proyectos.
- CRUD de tareas.
- Asociación de tareas a proyectos.
- Asignación opcional de responsables.
- Cambio de estado y prioridad.
- Filtros por proyecto, estado, prioridad y responsable.
- Historial de cambios de tareas almacenado en MongoDB.

## Tecnologías utilizadas

### Frontend

- React
- Vite
- TypeScript
- React Router DOM
- Axios
- Bootstrap 5
- Bootstrap Icons

### Backend

- Node.js
- Express
- TypeScript
- MySQL 8
- MongoDB
- mysql2
- mongoose
- cors
- dotenv
- express-validator
- nodemon

## Arquitectura Frontend y Backend

- `frontend/`: SPA en React con rutas, layout administrativo, tablas, formularios y modales.
- `backend/`: API REST en Express con capas separadas de configuración, rutas, controladores, servicios, validaciones y middlewares.
- `database/`: script SQL completo y ejemplos ejecutables de MongoDB.

## Estructura de carpetas

```text
gestor-proyectos/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── interfaces/
│   │   ├── pages/
│   │   ├── router/
│   │   └── utils/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── validators/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── database/
│   ├── mongodb.js
│   └── mysql.sql
├── .gitignore
└── README.md
```

## Modelo de datos

### MySQL

- `usuarios`: información base de usuarios responsables.
- `proyectos`: catálogo de proyectos con fechas y estado.
- `tareas`: tareas con prioridad, estado, proyecto y responsable.

### MongoDB

- `historial_tareas`: registro de creación, edición, cambios de estado, prioridad, responsable, proyecto y eliminación de tareas.

## Uso de MySQL

El archivo `database/mysql.sql` incluye:

- Creación de la base de datos `gestor_proyectos`.
- Creación de tablas, restricciones, llaves foráneas e índices.
- 5 usuarios de ejemplo.
- 3 proyectos de ejemplo.
- 8 tareas de ejemplo.
- Consultas SQL con `SELECT`, `INNER JOIN`, `LEFT JOIN`, `GROUP BY`, `COUNT`, `ORDER BY` y `WHERE`.

## Uso de MongoDB

El archivo `database/mongodb.js` contiene ejemplos ejecutables de:

- `insertOne()`
- `find()`
- `updateOne()`
- `deleteOne()`
- `createIndex()`

## Variables de entorno

### Backend

Archivo: `backend/.env`

```env
PORT=3000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=gestor_proyectos
MYSQL_USER=root
MYSQL_PASSWORD=
MONGO_URI=mongodb://localhost:27017/gestor_proyectos
CORS_ORIGIN=http://localhost:5173
```

### Frontend

Archivo: `frontend/.env`

```env
VITE_API_URL=http://localhost:3000/api
```

## Requisitos previos

- Node.js 18 o superior
- npm
- MySQL 8
- MongoDB ejecutándose localmente en `mongodb://localhost:27017`

## Instalación del backend

```bash
cd gestor-proyectos/backend
npm install
```

## Instalación del frontend

```bash
cd gestor-proyectos/frontend
npm install
```

## Ejecución local

### Backend

```bash
cd gestor-proyectos/backend
npm run dev
```

Servidor esperado: `http://localhost:3000`

### Frontend

```bash
cd gestor-proyectos/frontend
npm run dev
```

Aplicación esperada: `http://localhost:5173`

### Script SQL

Ejecuta manualmente:

```bash
mysql -u root -p < database/mysql.sql
```

O abre MySQL Workbench / CLI, selecciona el archivo `database/mysql.sql` y ejecútalo completo.

## Endpoints disponibles

### Dashboard

- `GET /api/dashboard/resumen`

### Usuarios

- `GET /api/usuarios`
- `GET /api/usuarios/:id`

### Proyectos

- `GET /api/proyectos`
- `GET /api/proyectos/:id`
- `POST /api/proyectos`
- `PUT /api/proyectos/:id`
- `DELETE /api/proyectos/:id`

### Tareas

- `GET /api/tareas`
- `GET /api/tareas/:id`
- `POST /api/tareas`
- `PUT /api/tareas/:id`
- `PATCH /api/tareas/:id/estado`
- `DELETE /api/tareas/:id`
- `GET /api/tareas/:id/historial`

Filtros admitidos:

- `GET /api/tareas?proyecto=1`
- `GET /api/tareas?estado=Pendiente`
- `GET /api/tareas?prioridad=Alta`
- `GET /api/tareas?responsable=2`
- `GET /api/tareas?proyecto=1&estado=Pendiente&prioridad=Alta`

## Consultas SQL solicitadas

Están incluidas en `database/mysql.sql`:

- Consultar todas las tareas.
- Consultar tareas con proyecto.
- Consultar tareas con proyecto y responsable.
- Contar tareas por estado.
- Contar tareas por proyecto.
- Ordenar tareas por fecha límite.
- Filtrar tareas pendientes.
- Filtrar tareas de prioridad alta.

## Operaciones MongoDB solicitadas

Están incluidas en `database/mongodb.js`:

- Crear índice compuesto `{ tareaId: 1, fecha: -1 }`
- Insertar historial
- Consultar historial
- Actualizar historial
- Eliminar historial

## Instrucciones para GitHub

```bash
git init
git add .
git commit -m "Implementación inicial del sistema"
git branch -M main
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```

## Capturas del sistema

Puedes agregar aquí capturas de:

- Dashboard
- Página de proyectos
- Página de tareas
- Modal de historial

## Integrantes del equipo

- Integrante 1
- Integrante 2
- Integrante 3

