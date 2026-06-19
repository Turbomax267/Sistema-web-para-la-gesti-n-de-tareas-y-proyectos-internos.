import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageMap: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Dashboard general',
    subtitle: 'Visión rápida del estado de proyectos y tareas del equipo.',
  },
  '/proyectos': {
    title: 'Gestión de proyectos',
    subtitle: 'Administra iniciativas activas, pausadas y planificadas.',
  },
  '/tareas': {
    title: 'Gestión de tareas',
    subtitle: 'Asigna responsables, controla prioridades y revisa historial.',
  },
};

function AppLayout() {
  const location = useLocation();
  const currentPage = pageMap[location.pathname] || {
    title: 'Página no encontrada',
    subtitle: 'La ruta solicitada no existe dentro del sistema.',
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-shell">
        <Header title={currentPage.title} subtitle={currentPage.subtitle} />
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;

