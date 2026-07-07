import { Sparkles } from "lucide-react";

/**
 * Card reutilizable para las secciones de selección múltiple del formulario
 * de casos (Tecnologías, Área de Aplicación, Equipo/Unidad). Solo presenta:
 * encabezado, bloque opcional "Detectadas por IA" (datos crudos del análisis
 * de documento, de solo lectura) y el selector interactivo que el padre le
 * pasa como children — no conoce ni toca el estado del formulario.
 */
export default function SelectionCard({ icon, title, aiItems = [], children }) {
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
              <Sparkles size={12} /> Detectadas por IA
            </p>
            <div className="selection-card-ai-chips">
              {aiItems.map((label, i) => (
                <span key={i} className="ai-chip">{label}</span>
              ))}
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
