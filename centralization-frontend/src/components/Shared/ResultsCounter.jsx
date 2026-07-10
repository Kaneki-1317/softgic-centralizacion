/**
 * Contador "N casos encontrados" — antes duplicado en AdminPage.jsx y
 * PublicPage.jsx.
 */
export default function ResultsCounter({ total }) {
  return (
    <p className="results-counter">
      {total} caso{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
    </p>
  );
}
