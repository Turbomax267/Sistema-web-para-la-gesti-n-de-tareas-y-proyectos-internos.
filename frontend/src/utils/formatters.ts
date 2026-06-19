export function formatDate(value?: string | null): string {
  if (!value) return 'Sin fecha';
  return new Date(value).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatNullableText(value?: string | null, emptyLabel = 'Sin asignar'): string {
  return value && value.trim().length > 0 ? value : emptyLabel;
}

export function getEstadoBadgeClass(estado: string): string {
  const map: Record<string, string> = {
    Pendiente: 'bg-secondary-subtle text-secondary-emphasis',
    'En Proceso': 'bg-warning-subtle text-warning-emphasis',
    'En Revisión': 'bg-info-subtle text-info-emphasis',
    Finalizado: 'bg-success-subtle text-success-emphasis',
    Planificado: 'bg-secondary-subtle text-secondary-emphasis',
    Activo: 'bg-success-subtle text-success-emphasis',
    Pausado: 'bg-warning-subtle text-warning-emphasis',
  };

  return map[estado] || 'bg-light text-dark';
}

export function getPrioridadBadgeClass(prioridad: string): string {
  const map: Record<string, string> = {
    Baja: 'bg-success-subtle text-success-emphasis',
    Media: 'bg-warning-subtle text-warning-emphasis',
    Alta: 'bg-danger-subtle text-danger-emphasis',
  };

  return map[prioridad] || 'bg-light text-dark';
}

