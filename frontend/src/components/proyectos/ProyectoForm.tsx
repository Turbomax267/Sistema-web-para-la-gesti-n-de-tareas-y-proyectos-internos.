import { FormEvent, useEffect, useState } from 'react';
import { Proyecto, ProyectoEstado, ProyectoPayload } from '../../interfaces/proyecto.interface';

const initialState: ProyectoPayload = {
  nombre: '',
  descripcion: '',
  fecha_inicio: '',
  fecha_fin: '',
  estado: 'Planificado',
};

const estados: ProyectoEstado[] = ['Planificado', 'Activo', 'Pausado', 'Finalizado'];

interface ProyectoFormProps {
  isOpen: boolean;
  proyecto?: Proyecto | null;
  onClose: () => void;
  onSubmit: (payload: ProyectoPayload) => Promise<void>;
}

function ProyectoForm({ isOpen, proyecto, onClose, onSubmit }: ProyectoFormProps) {
  const [form, setForm] = useState<ProyectoPayload>(initialState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (proyecto) {
      setForm({
        nombre: proyecto.nombre,
        descripcion: proyecto.descripcion || '',
        fecha_inicio: proyecto.fecha_inicio?.slice(0, 10) || '',
        fecha_fin: proyecto.fecha_fin?.slice(0, 10) || '',
        estado: proyecto.estado,
      });
      return;
    }

    setForm(initialState);
  }, [proyecto, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop-custom modal-shell-fancy">
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg fancy-modal-card">
          <form onSubmit={handleSubmit}>
            <div className="modal-header fancy-modal-header border-0">
              <div>
                <span className="fancy-modal-kicker">Gestion de proyectos</span>
                <h2 className="modal-title fs-3 mb-1">{proyecto ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
                <p className="text-muted mb-0">Define el alcance, estado y fechas principales del proyecto.</p>
              </div>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
            </div>
            <div className="modal-body pt-0">
              <div className="fancy-section-card mb-4">
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label fancy-label">Nombre del proyecto</label>
                    <input
                      className="form-control form-control-lg fancy-input"
                      placeholder="Ej. Plataforma interna de seguimiento"
                      value={form.nombre}
                      onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fancy-label">Descripcion</label>
                    <textarea
                      className="form-control fancy-input"
                      rows={5}
                      placeholder="Resume el objetivo y alcance del proyecto"
                      value={form.descripcion}
                      onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-lg-4">
                  <div className="fancy-section-card h-100">
                    <label className="form-label fancy-label">Fecha de inicio</label>
                    <input
                      type="date"
                      className="form-control fancy-input"
                      value={form.fecha_inicio}
                      onChange={(event) => setForm((prev) => ({ ...prev, fecha_inicio: event.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="fancy-section-card h-100">
                    <label className="form-label fancy-label">Fecha de fin</label>
                    <input
                      type="date"
                      className="form-control fancy-input"
                      value={form.fecha_fin}
                      onChange={(event) => setForm((prev) => ({ ...prev, fecha_fin: event.target.value }))}
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="fancy-section-card h-100">
                    <label className="form-label fancy-label">Estado actual</label>
                    <select
                      className="form-select fancy-input"
                      value={form.estado}
                      onChange={(event) => setForm((prev) => ({ ...prev, estado: event.target.value as ProyectoEstado }))}
                    >
                      {estados.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 pt-4">
              <button type="button" className="btn btn-light fancy-secondary-btn" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary fancy-primary-btn" disabled={submitting}>
                {submitting ? 'Guardando...' : 'Guardar proyecto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProyectoForm;
