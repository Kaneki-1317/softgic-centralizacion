import { Sparkles, Check } from "lucide-react";

/**
 * Card reutilizable para las secciones de selección múltiple del formulario
 * de casos (Tecnologías, Área de Aplicación, Equipo/Unidad). Presenta:
 * encabezado, bloque opcional "Detectadas por IA" y el selector interactivo
 * que el padre le pasa como children — no conoce el estado del formulario,
 * solo recibe ya resuelto qué nombre detectado coincide con el catálogo.
 *
 * `aiItems`: [{ label, matched }] — matched=true ya se seleccionó automáticamente
 * en el selector de abajo; matched=false todavía no existe en el catálogo y
 * el propio chip (via onCreateAiItem) se vuelve clickeable para crearlo,
 * sin reemplazar el selector, solo alimentándolo.
 */
export default function SelectionCard({
  icon,
  title,
  aiItems = [],
  onCreateAiItem,
  creatingLabels,
  children,
}) {
  const hasAiItems = aiItems && aiItems.length > 0;

  return (
    <section className="selection-card">
      <div className="selection-card-header">
        {icon}
        <h4>{title}</h4>
      </div>
      <hr className="selection-card-divider" />

      {hasAiItems && (
        <>
          <div className="selection-card-ai">
            <p className="selection-card-ai-label">
              <Sparkles size={12} /> Detectadas por IA haz click para crearlo
            </p>
            <div className="selection-card-ai-chips">
              {aiItems.map(({ label, matched }) => {
                if (matched) {
                  return (
                    <span key={label} className="ai-chip ai-chip-matched">
                      <Check size={11} className="ai-chip-check" />
                      {label}
                    </span>
                  );
                }

                const isCreating = creatingLabels?.has(label);
                return (
                  <button
                    key={label}
                    type="button"
                    className="ai-chip ai-chip-actionable"
                    onClick={() => onCreateAiItem?.(label)}
                    disabled={isCreating}
                    title={`Crear "${label}"`}
                  >
                    {isCreating ? "Creando..." : label}
                  </button>
                );
              })}
            </div>
          </div>
          <hr className="selection-card-divider" />
        </>
      )}

      <div className="selection-card-body">
        {children}
      </div>
    </section>
  );
}
