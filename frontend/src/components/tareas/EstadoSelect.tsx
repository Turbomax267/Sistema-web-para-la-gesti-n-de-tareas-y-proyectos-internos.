import { TareaEstado } from '../../interfaces/tarea.interface';

const estados: TareaEstado[] = ['Pendiente', 'En Proceso', 'En Revisión', 'Finalizado'];

interface EstadoSelectProps {
  value: TareaEstado;
  onChange: (estado: TareaEstado) => void;
}

function EstadoSelect({ value, onChange }: EstadoSelectProps) {
  return (
    <select className="form-select form-select-sm" value={value} onChange={(e) => onChange(e.target.value as TareaEstado)}>
      {estados.map((estado) => (
        <option key={estado} value={estado}>
          {estado}
        </option>
      ))}
    </select>
  );
}

export default EstadoSelect;

