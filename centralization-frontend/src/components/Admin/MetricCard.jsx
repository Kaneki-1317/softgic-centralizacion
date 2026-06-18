export default function MetricCard({
  title,
  value,
  icon,
}) {
  return (
    <article className="metric-card">

      <div className="metric-icon">
        {icon}
      </div>

      <div>
        <span className="metric-label">
          {title}
        </span>

        <h3>{value}</h3>
      </div>

    </article>
  );
}