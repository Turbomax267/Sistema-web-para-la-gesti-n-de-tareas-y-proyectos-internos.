interface LoadingSpinnerProps {
  label?: string;
}

function LoadingSpinner({ label = 'Cargando información...' }: LoadingSpinnerProps) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center gap-3 py-5">
      <div className="spinner-border text-primary" role="status" aria-hidden="true" />
      <span className="text-muted">{label}</span>
    </div>
  );
}

export default LoadingSpinner;

