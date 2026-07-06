import { useEffect, useRef, useState } from "react";
import CreateMethodChooser from "./CreateMethodChooser";
import DocumentUploadStep from "./DocumentUploadStep";
import AnalysisProgressStep from "./AnalysisProgressStep";
import { documentAnalysisService, STAGE } from "../../services/documentAnalysis";
import { inferTipoFromExtension } from "../../services/documentAnalysis/fileValidation";
import { useToast } from "../../context/ToastContext";

const STEP = {
  CHOOSER: "chooser",
  UPLOAD: "upload",
  ANALYZING: "analyzing",
};

/**
 * Los recursos quedan con URL vacía: todavía no existe almacenamiento real de
 * archivos (el backend solo admite referencias por URL). El usuario debe
 * completarla antes de enviar el caso; CaseFormModal.handleSubmit ya descarta
 * automáticamente cualquier recurso sin URL, igual que en el flujo manual.
 */
function mapAnalysisResultToPrefillData(result, files) {
  return {
    ...result,
    recursos: files.map((file) => ({
      tipo: inferTipoFromExtension(file.name),
      nombre: file.name,
      url: "",
    })),
  };
}

/**
 * Orquestador del flujo "Crear desde Documento": chooser -> upload -> analyzing.
 * No conoce tiposCasos/tecnologias/etc. — esa resolución de IDs vive solo en
 * CaseFormModal, reutilizando la lógica que ya usa para initialData.
 *
 * El padre (AdminPage) solo monta este componente mientras el wizard está
 * abierto — así el estado interno (paso actual, archivos, etapa de análisis)
 * siempre arranca limpio en cada apertura, sin necesitar un efecto que lo
 * reinicie. Al desmontar (usuario cierra el wizard), el cleanup del efecto de
 * abajo marca cancelledRef, para que un análisis en curso no reabra el
 * formulario después de que el usuario ya se fue.
 */
export default function NewCaseWizard({ onClose, onChooseManual, onComplete }) {
  const { showToast } = useToast();

  const [step, setStep] = useState(STEP.CHOOSER);
  const [fileEntries, setFileEntries] = useState([]);
  const [analysisStage, setAnalysisStage] = useState(null);
  const cancelledRef = useRef(false);

  // Red de seguridad adicional a handleClose: si el componente se desmonta
  // por otra razón (p. ej. el padre navega fuera de AdminPage) mientras un
  // análisis está en curso, evita que la promesa resuelta/erronea dispare
  // onComplete/showToast sobre un componente que ya no está.
  useEffect(() => {
    return () => { cancelledRef.current = true; };
  }, []);

  function handleClose() {
    cancelledRef.current = true;
    onClose();
  }

  function handleAnalyze() {
    const validFiles = fileEntries.filter((e) => e.validation.valid).map((e) => e.file);
    if (validFiles.length === 0) return;

    cancelledRef.current = false;
    setStep(STEP.ANALYZING);
    setAnalysisStage(STAGE.RECEIVED);

    documentAnalysisService
      .analyze(validFiles, {
        onProgress: (stage) => {
          if (!cancelledRef.current) setAnalysisStage(stage);
        },
      })
      .then((result) => {
        if (cancelledRef.current) return;
        onComplete(mapAnalysisResultToPrefillData(result, validFiles));
      })
      .catch((err) => {
        if (cancelledRef.current) return;
        showToast(err?.message || "Error al analizar el documento. Intenta de nuevo.", "error");
        setStep(STEP.UPLOAD);
      });
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>&#10005;</button>

        <div className="modal-body">
          {step === STEP.CHOOSER && (
            <CreateMethodChooser
              onChooseManual={onChooseManual}
              onChooseDocument={() => setStep(STEP.UPLOAD)}
            />
          )}

          {step === STEP.UPLOAD && (
            <DocumentUploadStep
              entries={fileEntries}
              onEntriesChange={setFileEntries}
              onAnalyze={handleAnalyze}
              onBack={() => setStep(STEP.CHOOSER)}
            />
          )}

          {step === STEP.ANALYZING && <AnalysisProgressStep currentStage={analysisStage} />}
        </div>
      </div>
    </div>
  );
}
