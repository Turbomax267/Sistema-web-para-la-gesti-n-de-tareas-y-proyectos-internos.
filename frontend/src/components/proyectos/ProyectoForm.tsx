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
    <div className="modal-backdrop-custom">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h2 className="modal-title fs-5">{proyecto ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Nombre</label>
                  <input
                    className="form-control"
                    value={form.nombre}
                    onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={form.descripcion}
                    onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Fecha de inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.fecha_inicio}
                    onChange={(event) => setForm((prev) => ({ ...prev, fecha_inicio: event.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Fecha de fin</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.fecha_fin}
                    onChange={(event) => setForm((prev) => ({ ...prev, fecha_fin: event.target.value }))}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={form.estado}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, estado: event.target.value as ProyectoEstado }))
                    }
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
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
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

