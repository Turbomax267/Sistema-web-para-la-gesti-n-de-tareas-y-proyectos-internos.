import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchProyectos } from '../api/proyectos.api';
import { createTarea, fetchHistorialTarea, fetchTareas, patchEstadoTarea, removeTarea, updateTarea } from '../api/tareas.api';
import { fetchUsuarios } from '../api/usuarios.api';
import AlertMessage from '../components/common/AlertMessage';
import ConfirmModal from '../components/common/ConfirmModal';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import HistorialModal from '../components/tareas/HistorialModal';
import TareaForm from '../components/tareas/TareaForm';
import { HistorialItem } from '../interfaces/historial.interface';
import { Proyecto } from '../interfaces/proyecto.interface';
import { Tarea, TareaEstado, TareaFilters, TareaPayload } from '../interfaces/tarea.interface';
import { Usuario } from '../interfaces/usuario.interface';
import { formatDate, formatNullableText, getEstadoBadgeClass, getPrioridadBadgeClass } from '../utils/formatters';

const initialFilters: TareaFilters = {
  proyecto: '',
  estado: '',
  prioridad: '',
  responsable: '',
};

function TareasPage() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filters, setFilters] = useState<TareaFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTarea, setSelectedTarea] = useState<Tarea | null>(null);
  const [tareaToDelete, setTareaToDelete] = useState<Tarea | null>(null);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [isHistorialOpen, setIsHistorialOpen] = useState(false);

  const loadDependencies = async () => {
    try {
      const [proyectosResponse, usuariosResponse] = await Promise.all([fetchProyectos(), fetchUsuarios()]);
      setProyectos(proyectosResponse.data);
      setUsuarios(usuariosResponse.data);
    } catch {
      setError('No se pudieron cargar proyectos o usuarios.');
    }
  };

  const loadTareas = async (activeFilters: TareaFilters) => {
    try {
      setLoading(true);
      const response = await fetchTareas(activeFilters);
      setTareas(response.data);
      setError('');
    } catch {
      setError('No se pudieron cargar las tareas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDependencies();
  }, []);

  useEffect(() => {
    void loadTareas(filters);
  }, [filters]);

  const handleSubmit = async (payload: TareaPayload) => {
    try {
      if (selectedTarea) {
        const response = await updateTarea(selectedTarea.id_tarea, payload);
        setTareas((prev) => prev.map((item) => (item.id_tarea === selectedTarea.id_tarea ? response.data : item)));
        setFeedback(response.message);
      } else {
        const response = await createTarea(payload);
        setTareas((prev) => [response.data, ...prev]);
        setFeedback(response.message);
      }
      setError('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'No se pudo guardar la tarea.');
        return;
      }
      setError('No se pudo guardar la tarea.');
    }
  };

  const handleDelete = async () => {
    if (!tareaToDelete) return;

    try {
      const response = await removeTarea(tareaToDelete.id_tarea);
      setTareas((prev) => prev.filter((item) => item.id_tarea !== tareaToDelete.id_tarea));
      setFeedback(response.message);
      setError('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'No se pudo eliminar la tarea.');
      } else {
        setError('No se pudo eliminar la tarea.');
      }
    } finally {
      setTareaToDelete(null);
    }
  };

  const handleEstadoChange = async (tarea: Tarea, estado: TareaEstado) => {
    try {
      const response = await patchEstadoTarea(tarea.id_tarea, estado);
      setTareas((prev) => prev.map((item) => (item.id_tarea === tarea.id_tarea ? response.data : item)));
      setFeedback(response.message);
      setError('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'No se pudo cambiar el estado.');
        return;
      }
      setError('No se pudo cambiar el estado.');
    }
  };

  const openHistorial = async (tarea: Tarea) => {
    try {
      const response = await fetchHistorialTarea(tarea.id_tarea);
      setHistorial(response.data);
      setIsHistorialOpen(true);
    } catch {
      setError('No se pudo cargar el historial de la tarea.');
    }
  };

  return (
    <section className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h3 className="h4 mb-1">Tareas del equipo</h3>
          <p className="text-muted mb-0">Filtra, reasigna y monitorea el avance operativo.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          disabled={proyectos.length === 0}
          onClick={() => {
            setSelectedTarea(null);
            setIsFormOpen(true);
          }}
        >
          <i className="bi bi-plus-lg me-2" />
          Nueva tarea
        </button>
      </div>

      {feedback && <AlertMessage type="success" message={feedback} />}
      {error && <AlertMessage type="danger" message={error} />}

      <div className="content-card">
        <div className="row g-3 align-items-end mb-3">
          <div className="col-md-3">
            <label className="form-label">Proyecto</label>
            <select
              className="form-select"
              value={filters.proyecto}
              onChange={(event) => setFilters((prev) => ({ ...prev, proyecto: event.target.value }))}
            >
              <option value="">Todos</option>
              {proyectos.map((proyecto) => (
                <option key={proyecto.id_proyecto} value={proyecto.id_proyecto}>
                  {proyecto.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Estado</label>
            <select
              className="form-select"
              value={filters.estado}
              onChange={(event) => setFilters((prev) => ({ ...prev, estado: event.target.value }))}
            >
              <option value="">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="En Revisión">En Revisión</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Prioridad</label>
            <select
              className="form-select"
              value={filters.prioridad}
              onChange={(event) => setFilters((prev) => ({ ...prev, prioridad: event.target.value }))}
            >
              <option value="">Todas</option>
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Responsable</label>
            <select
              className="form-select"
              value={filters.responsable}
              onChange={(event) => setFilters((prev) => ({ ...prev, responsable: event.target.value }))}
            >
              <option value="">Todos</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id_usuario} value={usuario.id_usuario}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button type="button" className="btn btn-outline-secondary w-100" onClick={() => setFilters(initialFilters)}>
              Limpiar filtros
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Cargando tareas..." />
        ) : tareas.length === 0 ? (
          <EmptyState
            icon="bi-list-task"
            title="No se encontraron tareas"
            description="Prueba ajustando los filtros o crea una nueva tarea."
          />
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Proyecto</th>
                  <th>Responsable</th>
                  <th>Estado</th>
                  <th>Prioridad</th>
                  <th>Fecha límite</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tareas.map((tarea) => (
                  <tr key={tarea.id_tarea}>
                    <td className="fw-semibold">{tarea.titulo}</td>
                    <td>{tarea.proyecto}</td>
                    <td>{formatNullableText(tarea.responsable)}</td>
                    <td>
                      <span className={`badge rounded-pill ${getEstadoBadgeClass(tarea.estado)}`}>{tarea.estado}</span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${getPrioridadBadgeClass(tarea.prioridad)}`}>{tarea.prioridad}</span>
                    </td>
                    <td>{formatDate(tarea.fecha_limite)}</td>
                    <td>
                      <div className="d-flex justify-content-end gap-2 flex-wrap">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setSelectedTarea(tarea);
                            setIsFormOpen(true);
                          }}
                        >
                          <i className="bi bi-pencil-square me-1" />
                          Editar
                        </button>
                        <select
                          className="form-select form-select-sm action-select"
                          value={tarea.estado}
                          onChange={(event) => void handleEstadoChange(tarea, event.target.value as TareaEstado)}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En Proceso">En Proceso</option>
                          <option value="En Revisión">En Revisión</option>
                          <option value="Finalizado">Finalizado</option>
                        </select>
                        <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => void openHistorial(tarea)}>
                          <i className="bi bi-clock-history me-1" />
                          Historial
                        </button>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setTareaToDelete(tarea)}>
                          <i className="bi bi-trash3 me-1" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TareaForm
        isOpen={isFormOpen}
        tarea={selectedTarea}
        proyectos={proyectos}
        usuarios={usuarios}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <HistorialModal isOpen={isHistorialOpen} historial={historial} onClose={() => setIsHistorialOpen(false)} />

      <ConfirmModal
        isOpen={Boolean(tareaToDelete)}
        title="Eliminar tarea"
        message={`¿Deseas eliminar la tarea "${tareaToDelete?.titulo}"?`}
        confirmText="Eliminar"
        onConfirm={handleDelete}
        onClose={() => setTareaToDelete(null)}
      />
    </section>
  );
}

export default TareasPage;

