import { useEffect, useState } from 'react';
import { fetchDashboard } from '../api/dashboard.api';
import AlertMessage from '../components/common/AlertMessage';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { DashboardSummary } from '../interfaces/dashboard.interface';
import { formatDate, formatNullableText, getEstadoBadgeClass, getPrioridadBadgeClass } from '../utils/formatters';

function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetchDashboard();
        setDashboard(response.data);
      } catch (err) {
        setError('No se pudo cargar el dashboard. Verifica la conexión con el backend.');
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  if (loading) return <LoadingSpinner label="Cargando dashboard..." />;
  if (error) return <AlertMessage type="danger" message={error} />;
  if (!dashboard) return <EmptyState icon="bi-bar-chart-line" title="Sin datos" description="No se encontró información para el dashboard." />;

  const cards = [
    { label: 'Total de proyectos', value: dashboard.totalProyectos, icon: 'bi-kanban-fill' },
    { label: 'Proyectos activos', value: dashboard.proyectosActivos, icon: 'bi-rocket-takeoff-fill' },
    { label: 'Total de tareas', value: dashboard.totalTareas, icon: 'bi-list-task' },
    { label: 'Pendientes', value: dashboard.tareasPendientes, icon: 'bi-hourglass-split' },
    { label: 'En proceso', value: dashboard.tareasEnProceso, icon: 'bi-gear-fill' },
    { label: 'En revisión', value: dashboard.tareasEnRevision, icon: 'bi-search' },
    { label: 'Finalizadas', value: dashboard.tareasFinalizadas, icon: 'bi-check2-circle' },
  ];

  return (
    <section className="d-flex flex-column gap-4">
      <div className="row g-3">
        {cards.map((card) => (
          <div key={card.label} className="col-12 col-md-6 col-xl">
            <article className="stat-card h-100">
              <div className="stat-icon">
                <i className={`bi ${card.icon}`} />
              </div>
              <div>
                <p className="text-muted mb-1">{card.label}</p>
                <h3 className="mb-0">{card.value}</h3>
              </div>
            </article>
          </div>
        ))}
      </div>

      <div className="content-card">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div>
            <h3 className="h5 mb-1">Tareas próximas a vencer</h3>
            <p className="text-muted mb-0">Seguimiento rápido de entregables prioritarios.</p>
          </div>
        </div>

        {dashboard.proximasTareas.length === 0 ? (
          <EmptyState
            icon="bi-calendar-check"
            title="Sin tareas próximas"
            description="No hay tareas con fecha límite registrada."
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
                </tr>
              </thead>
              <tbody>
                {dashboard.proximasTareas.map((tarea) => (
                  <tr key={tarea.id_tarea}>
                    <td>{tarea.titulo}</td>
                    <td>{tarea.proyecto}</td>
                    <td>{formatNullableText(tarea.responsable)}</td>
                    <td>
                      <span className={`badge rounded-pill ${getEstadoBadgeClass(tarea.estado)}`}>{tarea.estado}</span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${getPrioridadBadgeClass(tarea.prioridad)}`}>{tarea.prioridad}</span>
                    </td>
                    <td>{formatDate(tarea.fecha_limite)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default DashboardPage;

