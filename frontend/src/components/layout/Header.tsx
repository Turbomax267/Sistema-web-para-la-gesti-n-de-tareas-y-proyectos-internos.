interface HeaderProps {
  title: string;
  subtitle: string;
}

function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="page-header d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
      <div>
        <p className="text-uppercase header-label mb-2">Panel interno</p>
        <h2 className="mb-1">{title}</h2>
        <p className="text-muted mb-0">{subtitle}</p>
      </div>
      <div className="header-chip">
        <i className="bi bi-lightning-charge-fill" />
        <span>Operación coordinada</span>
      </div>
    </header>
  );
}

export default Header;

