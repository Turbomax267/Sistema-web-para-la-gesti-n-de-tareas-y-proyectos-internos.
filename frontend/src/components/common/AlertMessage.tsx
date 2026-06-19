interface AlertMessageProps {
  type?: 'success' | 'danger' | 'warning' | 'info';
  message: string;
}

function AlertMessage({ type = 'info', message }: AlertMessageProps) {
  return <div className={`alert alert-${type} mb-0`}>{message}</div>;
}

export default AlertMessage;

