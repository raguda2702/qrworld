type Props = { title: string; subtitle?: string; action?: React.ReactNode; };
export function PageHeader({ title, subtitle, action }: Props) {
  return (
    <div className="mobile-stack mb-6">
      <div>
        <h1 className="section-title">{title}</h1>
        {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
