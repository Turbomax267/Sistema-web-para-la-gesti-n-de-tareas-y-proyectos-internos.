CREATE DATABASE IF NOT EXISTS gestor_proyectos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestor_proyectos;

DROP TABLE IF EXISTS tareas;
DROP TABLE IF EXISTS proyectos;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(120) NOT NULL UNIQUE,
  cargo VARCHAR(80) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE proyectos (
  id_proyecto INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NULL,
  estado ENUM('Planificado', 'Activo', 'Pausado', 'Finalizado') NOT NULL DEFAULT 'Planificado',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_proyectos_fechas CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

CREATE TABLE tareas (
  id_tarea INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT NULL,
  estado ENUM('Pendiente', 'En Proceso', 'En Revisión', 'Finalizado') NOT NULL DEFAULT 'Pendiente',
  prioridad ENUM('Baja', 'Media', 'Alta') NOT NULL DEFAULT 'Media',
  fecha_limite DATE NULL,
  id_proyecto INT NOT NULL,
  id_responsable INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tareas_proyecto FOREIGN KEY (id_proyecto) REFERENCES proyectos(id_proyecto),
  CONSTRAINT fk_tareas_responsable FOREIGN KEY (id_responsable) REFERENCES usuarios(id_usuario),
  INDEX idx_tareas_estado (estado),
  INDEX idx_tareas_id_proyecto (id_proyecto),
  INDEX idx_tareas_id_responsable (id_responsable),
  INDEX idx_tareas_proyecto_estado (id_proyecto, estado)
);

INSERT INTO usuarios (nombre, correo, cargo) VALUES
('Ana Torres', 'ana.torres@startup.com', 'Project Manager'),
('Luis Rojas', 'luis.rojas@startup.com', 'Backend Developer'),
('María Paredes', 'maria.paredes@startup.com', 'Frontend Developer'),
('Jorge Salazar', 'jorge.salazar@startup.com', 'QA Analyst'),
('Camila Díaz', 'camila.diaz@startup.com', 'Product Designer');

INSERT INTO proyectos (nombre, descripcion, fecha_inicio, fecha_fin, estado) VALUES
('Portal de clientes', 'Rediseño completo del portal de autogestión para clientes.', '2026-06-01', '2026-08-15', 'Activo'),
('App de métricas', 'Tablero analítico para seguimiento de KPIs internos.', '2026-05-20', '2026-07-30', 'Pausado'),
('Automatización de soporte', 'Sistema para automatizar tickets frecuentes y flujos internos.', '2026-04-10', NULL, 'Planificado');

INSERT INTO tareas (titulo, descripcion, estado, prioridad, fecha_limite, id_proyecto, id_responsable) VALUES
('Definir roadmap del portal', 'Alinear hitos y entregables con stakeholders.', 'En Proceso', 'Alta', '2026-06-24', 1, 1),
('Implementar API de clientes', 'Construir endpoints para perfil y facturación.', 'Pendiente', 'Alta', '2026-06-28', 1, 2),
('Diseñar módulo de reportes', 'Diseño UI inicial del módulo de reportes.', 'En Revisión', 'Media', '2026-06-25', 2, 3),
('Pruebas del tablero KPI', 'Validar métricas y consistencia de datos.', 'Pendiente', 'Media', '2026-06-27', 2, 4),
('Mapa de tickets frecuentes', 'Levantamiento de incidencias para automatización.', 'Finalizado', 'Baja', '2026-06-10', 3, 5),
('Integración con chatbot', 'Conectar reglas de negocio con asistente.', 'Pendiente', 'Alta', '2026-07-05', 3, 2),
('Ajuste de estilos responsive', 'Refinar experiencia móvil del portal.', 'En Proceso', 'Media', '2026-06-23', 1, 3),
('Casos de prueba críticos', 'Definir regresión mínima del sprint.', 'Pendiente', 'Alta', '2026-06-22', 1, 4);

-- 1. Consultar todas las tareas
SELECT * FROM tareas;

-- 2. Consultar las tareas con el nombre del proyecto
SELECT t.id_tarea, t.titulo, t.estado, p.nombre AS proyecto
FROM tareas t
INNER JOIN proyectos p ON t.id_proyecto = p.id_proyecto;

-- 3. Consultar las tareas con proyecto y responsable
SELECT
  t.id_tarea,
  t.titulo,
  p.nombre AS proyecto,
  u.nombre AS responsable
FROM tareas t
INNER JOIN proyectos p ON t.id_proyecto = p.id_proyecto
LEFT JOIN usuarios u ON t.id_responsable = u.id_usuario;

-- 4. Contar tareas por estado
SELECT estado, COUNT(*) AS total
FROM tareas
GROUP BY estado;

-- 5. Contar tareas por proyecto
SELECT p.nombre AS proyecto, COUNT(t.id_tarea) AS total_tareas
FROM proyectos p
LEFT JOIN tareas t ON p.id_proyecto = t.id_proyecto
GROUP BY p.id_proyecto, p.nombre;

-- 6. Ordenar tareas por fecha límite
SELECT id_tarea, titulo, fecha_limite
FROM tareas
ORDER BY fecha_limite ASC;

-- 7. Filtrar tareas pendientes
SELECT id_tarea, titulo, estado
FROM tareas
WHERE estado = 'Pendiente';

-- 8. Filtrar tareas de prioridad alta
SELECT id_tarea, titulo, prioridad
FROM tareas
WHERE prioridad = 'Alta';

