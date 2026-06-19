import { FormEvent, useEffect, useState } from 'react';
import { Proyecto } from '../../interfaces/proyecto.interface';
import { Tarea, TareaEstado, TareaPayload, TareaPrioridad } from '../../interfaces/tarea.interface';
import { Usuario } from '../../interfaces/usuario.interface';

const estados: TareaEstado[] = ['Pendiente', 'En Proceso', 'En Revisión', 'Finalizado'];
const prioridades: TareaPrioridad[] = ['Baja', 'Media', 'Alta'];

const initialState: TareaPayload = {
  titulo: '',
  descripcion: '',
  estado: 'Pendiente',
  prioridad: 'Media',
  fecha_limite: '',
  id_proyecto: 0,
  id_responsable: null,
};

interface TareaFormProps {
  isOpen: boolean;
  tarea?: Tarea | null;
  proyectos: Proyecto[];
  usuarios: Usuario[];
  onClose: () => void;
  onSubmit: (payload: TareaPayload) => Promise<void>;
}

function TareaForm({ isOpen, tarea, proyectos, usuarios, onClose, onSubmit }: TareaFormProps) {
  const [form, setForm] = useState<TareaPayload>(initialState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (tarea) {
      setForm({
        titulo: tarea.titulo,
        descripcion: tarea.descripcion || '',
        estado: tarea.estado,
        prioridad: tarea.prioridad,
        fecha_limite: tarea.fecha_limite?.slice(0, 10) || '',
        id_proyecto: tarea.id_proyecto,
        id_responsable: tarea.id_responsable,
      });
      return;
    }

    setForm({
      ...initialState,
      id_proyecto: proyectos[0]?.id_proyecto || 0,
    });
  }, [tarea, proyectos, isOpen]);

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
                <span className="fancy-modal-kicker">Gestion de tareas</span>
                <h2 className="modal-title fs-3 mb-1">{tarea ? 'Editar tarea' : 'Nueva tarea'}</h2>
                <p className="text-muted mb-0">Organiza responsables, prioridad y seguimiento operativo.</p>
              </div>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
            </div>
            <div className="modal-body pt-0">
              <div className="fancy-section-card mb-4">
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label fancy-label">Titulo de la tarea</label>
                    <input
                      className="form-control form-control-lg fancy-input"
                      placeholder="Ej. Validar entregables del sprint"
                      value={form.titulo}
                      onChange={(event) => setForm((prev) => ({ ...prev, titulo: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fancy-label">Descripcion</label>
                    <textarea
                      className="form-control fancy-input"
                      rows={5}
                      placeholder="Describe el objetivo y alcance de la tarea"
                      value={form.descripcion}
                      onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="fancy-section-card h-100">
                    <label className="form-label fancy-label">Proyecto asociado</label>
                    <select
                      className="form-select fancy-input"
                      value={form.id_proyecto}
                      onChange={(event) => setForm((prev) => ({ ...prev, id_proyecto: Number(event.target.value) }))}
                      required
                    >
                      {proyectos.map((proyecto) => (
                        <option key={proyecto.id_proyecto} value={proyecto.id_proyecto}>
                          {proyecto.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="fancy-section-card h-100">
                    <label className="form-label fancy-label">Responsable</label>
                    <select
                      className="form-select fancy-input"
                      value={form.id_responsable ?? ''}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          id_responsable: event.target.value ? Number(event.target.value) : null,
                        }))
                      }
                    >
                      <option value="">Sin asignar</option>
                      {usuarios.map((usuario) => (
                        <option key={usuario.id_usuario} value={usuario.id_usuario}>
                          {usuario.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="fancy-section-card h-100">
                    <label className="form-label fancy-label">Estado</label>
                    <select
                      className="form-select fancy-input"
                      value={form.estado}
                      onChange={(event) => setForm((prev) => ({ ...prev, estado: event.target.value as TareaEstado }))}
                    >
                      {estados.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="fancy-section-card h-100">
                    <label className="form-label fancy-label">Prioridad</label>
                    <select
                      className="form-select fancy-input"
                      value={form.prioridad}
                      onChange={(event) => setForm((prev) => ({ ...prev, prioridad: event.target.value as TareaPrioridad }))}
                    >
                      {prioridades.map((prioridad) => (
                        <option key={prioridad} value={prioridad}>
                          {prioridad}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="fancy-section-card h-100">
                    <label className="form-label fancy-label">Fecha limite</label>
                    <input
                      type="date"
                      className="form-control fancy-input"
                      value={form.fecha_limite}
                      onChange={(event) => setForm((prev) => ({ ...prev, fecha_limite: event.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 pt-4">
              <button type="button" className="btn btn-light fancy-secondary-btn" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary fancy-primary-btn" disabled={submitting || proyectos.length === 0}>
                {submitting ? 'Guardando...' : 'Guardar tarea'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TareaForm;
