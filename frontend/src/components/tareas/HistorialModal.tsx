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
    <div className="modal-backdrop-custom modal-shell-fancy">
      <div className="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg fancy-modal-card historial-modal-card">
          <div className="modal-header fancy-modal-header border-0">
            <div>
              <span className="fancy-modal-kicker">Trazabilidad</span>
              <h2 className="modal-title fs-3 mb-1">Historial de la tarea</h2>
              <p className="text-muted mb-0">Consulta los cambios registrados desde el evento más reciente.</p>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
          </div>
          <div className="modal-body pt-0">
            {historial.length === 0 ? (
              <div className="fancy-section-card text-center py-5">
                <i className="bi bi-clock-history display-5 text-primary" />
                <h3 className="h5 mt-3">Sin movimientos registrados</h3>
                <p className="text-muted mb-0">Esta tarea aun no tiene cambios guardados en el historial.</p>
              </div>
            ) : (
              <div className="timeline-list timeline-fancy-list">
                {historial.map((item) => (
                  <div key={item._id} className="timeline-item timeline-fancy-item">
                    <div className="timeline-dot timeline-fancy-dot" />
                    <div className="timeline-card timeline-fancy-card">
                      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 align-items-md-center">
                        <div>
                          <span className="timeline-pill">{item.accion.split('_').join(' ')}</span>
                          <p className="mb-0 mt-3 fw-semibold">{item.descripcion}</p>
                        </div>
                        <span className="text-muted small">{formatDate(item.fecha)}</span>
                      </div>
                      <div className="timeline-meta mt-3">
                        <span>Campo modificado</span>
                        <strong>{item.campoModificado}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer border-0 pt-3">
            <button type="button" className="btn btn-light fancy-secondary-btn" onClick={onClose}>
              Cerrar historial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistorialModal;
