import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { STAGE_ORDER, STAGE_LABELS } from "../../services/documentAnalysis";

/**
 * Vista puramente presentacional: no conoce tiempos ni lógica de negocio.
 * Recibe la etapa actual y deriva el estado (done/active/pending) de cada
 * fila comparando índices contra STAGE_ORDER.
 */
export default function AnalysisProgressStep({ currentStage }) {
  const currentIndex = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className="analysis-progress-wrap">
      <p className="analysis-progress-title">Analizando documento...</p>
      <p className="analysis-progress-subtitle">
        Esto puede tardar unos segundos. No cierres esta ventana.
      </p>

      <ul className="analysis-progress-list">
        {STAGE_ORDER.map((stage, index) => {
          const state =
            index < currentIndex ? "done" : index === currentIndex ? "active" : "pending";

          return (
            <li key={stage} className={`analysis-progress-item ${state}`}>
              <span className="analysis-progress-icon">
                {state === "done" && <CheckCircle2 size={18} />}
                {state === "active" && <Loader2 size={18} className="spin" />}
                {state === "pending" && <Circle size={18} />}
              </span>
              <span className="analysis-progress-label">{STAGE_LABELS[stage]}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
