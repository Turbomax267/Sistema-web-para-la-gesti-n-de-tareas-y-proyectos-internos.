import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
  { to: '/proyectos', label: 'Proyectos', icon: 'bi-kanban-fill' },
  { to: '/tareas', label: 'Tareas', icon: 'bi-list-check' },
];

function Sidebar() {
  return (
    <aside className="sidebar-panel">
      <div>
        <span className="sidebar-kicker">Startup Ops</span>
        <h1 className="sidebar-brand">Gestor de Proyectos</h1>
      </div>
      <nav className="nav flex-column gap-2 mt-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className={`bi ${link.icon}`} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

