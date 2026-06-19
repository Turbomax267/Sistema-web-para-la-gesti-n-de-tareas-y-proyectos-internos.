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
    <div className="modal-backdrop-custom">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h2 className="modal-title fs-5">{tarea ? 'Editar tarea' : 'Nueva tarea'}</h2>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Título</label>
                  <input
                    className="form-control"
                    value={form.titulo}
                    onChange={(event) => setForm((prev) => ({ ...prev, titulo: event.target.value }))}
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
                <div className="col-md-6">
                  <label className="form-label">Proyecto</label>
                  <select
                    className="form-select"
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
                <div className="col-md-6">
                  <label className="form-label">Responsable</label>
                  <select
                    className="form-select"
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
                <div className="col-md-4">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
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
                <div className="col-md-4">
                  <label className="form-label">Prioridad</label>
                  <select
                    className="form-select"
                    value={form.prioridad}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, prioridad: event.target.value as TareaPrioridad }))
                    }
                  >
                    {prioridades.map((prioridad) => (
                      <option key={prioridad} value={prioridad}>
                        {prioridad}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Fecha límite</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.fecha_limite}
                    onChange={(event) => setForm((prev) => ({ ...prev, fecha_limite: event.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting || proyectos.length === 0}>
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

