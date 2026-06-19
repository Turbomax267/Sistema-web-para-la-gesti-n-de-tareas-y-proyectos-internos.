interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-custom modal-shell-fancy">
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content shadow-lg border-0 fancy-modal-card confirm-modal-card">
          <div className="modal-header fancy-modal-header border-0 pb-2">
            <div>
              <span className="fancy-modal-kicker danger-kicker">Accion sensible</span>
              <h2 className="modal-title fs-3 mb-1">{title}</h2>
              <p className="text-muted mb-0">Confirma la accion antes de continuar.</p>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
          </div>
          <div className="modal-body pt-0">
            <div className="confirm-icon-wrap">
              <div className="confirm-icon-circle">
                <i className="bi bi-exclamation-triangle-fill" />
              </div>
            </div>
            <p className="confirm-message mb-0 text-center">{message}</p>
          </div>
          <div className="modal-footer border-0 justify-content-center pt-4">
            <button type="button" className="btn btn-light fancy-secondary-btn" onClick={onClose}>
              {cancelText}
            </button>
            <button type="button" className="btn btn-danger fancy-danger-btn" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
