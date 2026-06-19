import { HistorialItem } from '../../interfaces/historial.interface';
import { formatDate } from '../../utils/formatters';

interface HistorialModalProps {
  isOpen: boolean;
  historial: HistorialItem[];
  onClose: () => void;
}

function HistorialModal({ isOpen, historial, onClose }: HistorialModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header">
            <h2 className="modal-title fs-5">Historial de la tarea</h2>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
          </div>
          <div className="modal-body">
            {historial.length === 0 ? (
              <p className="text-muted mb-0">No hay movimientos registrados para esta tarea.</p>
            ) : (
              <div className="timeline-list">
                {historial.map((item) => (
                  <div key={item._id} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-card">
                      <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                        <strong>{item.accion.split('_').join(' ')}</strong>
                        <span className="text-muted small">{formatDate(item.fecha)}</span>
                      </div>
                      <p className="mb-1 mt-2">{item.descripcion}</p>
                      <small className="text-muted">Campo: {item.campoModificado}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistorialModal;

