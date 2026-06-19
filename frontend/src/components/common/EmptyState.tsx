interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="empty-state text-center py-5">
      <i className={`bi ${icon} display-4 text-primary`} />
      <h3 className="h5 mt-3">{title}</h3>
      <p className="text-muted mb-0">{description}</p>
    </div>
  );
}

export default EmptyState;

