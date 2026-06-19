import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="content-card text-center py-5">
      <p className="text-uppercase text-muted mb-2">404</p>
      <h3 className="mb-3">La ruta solicitada no existe</h3>
      <p className="text-muted mb-4">Puedes volver al dashboard para seguir gestionando proyectos y tareas.</p>
      <Link to="/" className="btn btn-primary">
        Volver al dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;

