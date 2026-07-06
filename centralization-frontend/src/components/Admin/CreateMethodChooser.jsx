import { ClipboardEdit, Sparkles } from "lucide-react";

/**
 * Paso 1 del wizard: elegir entre crear un caso manualmente (flujo actual,
 * sin cambios) o a partir de un documento (nuevo flujo, en esta pantalla
 * solo se elige el método).
 */
export default function CreateMethodChooser({ onChooseManual, onChooseDocument }) {
  return (
    <div className="method-choice-wrap">
      <p className="form-modal-eyebrow">Nuevo Caso</p>
      <h4 className="modal-section-label">¿Cómo quieres crear el caso?</h4>

      <div className="method-choice-grid">
        <button type="button" className="method-choice-card" onClick={onChooseManual}>
          <span className="method-choice-icon">
            <ClipboardEdit size={26} />
          </span>
          <span className="method-choice-title">Crear Manualmente</span>
          <span className="method-choice-desc">
            Completa el formulario del caso desde cero, campo por campo.
          </span>
        </button>

        <button type="button" className="method-choice-card" onClick={onChooseDocument}>
          <span className="method-choice-icon">
            <Sparkles size={26} />
          </span>
          <span className="method-choice-title">Crear desde Documento</span>
          <span className="method-choice-desc">
            Sube un documento y deja que se complete automáticamente. Podrás revisar y editar todo antes de guardar.
          </span>
        </button>
      </div>
    </div>
  );
}
