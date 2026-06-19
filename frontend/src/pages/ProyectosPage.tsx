import { useEffect, useState } from 'react';
import axios from 'axios';
import { createProyecto, fetchProyectos, removeProyecto, updateProyecto } from '../api/proyectos.api';
import AlertMessage from '../components/common/AlertMessage';
import ConfirmModal from '../components/common/ConfirmModal';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProyectoForm from '../components/proyectos/ProyectoForm';
import { Proyecto, ProyectoPayload } from '../interfaces/proyecto.interface';
import { formatDate, formatNullableText, getEstadoBadgeClass } from '../utils/formatters';

function ProyectosPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);
  const [proyectoToDelete, setProyectoToDelete] = useState<Proyecto | null>(null);

  const loadProyectos = async () => {
    try {
      setLoading(true);
      const response = await fetchProyectos();
      setProyectos(response.data);
      setError('');
    } catch {
      setError('No se pudieron cargar los proyectos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProyectos();
  }, []);

  const handleSubmit = async (payload: ProyectoPayload) => {
    try {
      if (selectedProyecto) {
        const response = await updateProyecto(selectedProyecto.id_proyecto, payload);
        setProyectos((prev) => prev.map((item) => (item.id_proyecto === selectedProyecto.id_proyecto ? response.data : item)));
        setFeedback(response.message);
      } else {
        const response = await createProyecto(payload);
        setProyectos((prev) => [response.data, ...prev]);
        setFeedback(response.message);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'No se pudo guardar el proyecto.');
        return;
      }
      setError('No se pudo guardar el proyecto.');
    }
  };

  const handleDelete = async () => {
    if (!proyectoToDelete) return;

    try {
      const response = await removeProyecto(proyectoToDelete.id_proyecto);
      setProyectos((prev) => prev.filter((item) => item.id_proyecto !== proyectoToDelete.id_proyecto));
      setFeedback(response.message);
      setError('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'No se pudo eliminar el proyecto.');
      } else {
        setError('No se pudo eliminar el proyecto.');
      }
    } finally {
      setProyectoToDelete(null);
    }
  };

  return (
    <section className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h3 className="h4 mb-1">Proyectos registrados</h3>
          <p className="text-muted mb-0">Crea, edita y controla los proyectos internos del equipo.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setSelectedProyecto(null);
            setIsModalOpen(true);
          }}
        >
          <i className="bi bi-plus-lg me-2" />
          Nuevo proyecto
        </button>
      </div>

      {feedback && <AlertMessage type="success" message={feedback} />}
      {error && <AlertMessage type="danger" message={error} />}

      <div className="content-card">
        {loading ? (
          <LoadingSpinner label="Cargando proyectos..." />
        ) : proyectos.length === 0 ? (
          <EmptyState
            icon="bi-kanban"
            title="Aún no hay proyectos"
            description="Empieza creando el primer proyecto para organizar al equipo."
          />
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Fecha de inicio</th>
                  <th>Fecha de fin</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proyectos.map((proyecto) => (
                  <tr key={proyecto.id_proyecto}>
                    <td className="fw-semibold">{proyecto.nombre}</td>
                    <td>{formatNullableText(proyecto.descripcion, 'Sin descripción')}</td>
                    <td>{formatDate(proyecto.fecha_inicio)}</td>
                    <td>{formatDate(proyecto.fecha_fin)}</td>
                    <td>
                      <span className={`badge rounded-pill ${getEstadoBadgeClass(proyecto.estado)}`}>{proyecto.estado}</span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setSelectedProyecto(proyecto);
                            setIsModalOpen(true);
                          }}
                        >
                          <i className="bi bi-pencil-square me-1" />
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => setProyectoToDelete(proyecto)}
                        >
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

      <ProyectoForm
        isOpen={isModalOpen}
        proyecto={selectedProyecto}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        isOpen={Boolean(proyectoToDelete)}
        title="Eliminar proyecto"
        message={`¿Deseas eliminar el proyecto "${proyectoToDelete?.nombre}"?`}
        confirmText="Eliminar"
        onConfirm={handleDelete}
        onClose={() => setProyectoToDelete(null)}
      />
    </section>
  );
}

export default ProyectosPage;

