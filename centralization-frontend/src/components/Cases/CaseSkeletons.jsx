export default function CaseSkeletons() {
  return (
    <div className="case-grid">

      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="case-card skeleton-card"
        >
          <span />
          <strong />
          <p />
        </div>
      ))}

    </div>
  );
}