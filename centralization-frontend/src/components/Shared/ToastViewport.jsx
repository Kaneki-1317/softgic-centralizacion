import { CheckCircle, XCircle, Info } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const ICONS = {
  success: <CheckCircle size={18} />,
  error:   <XCircle size={18} />,
  info:    <Info size={18} />,
};

export default function ToastViewport() {
  const { toasts } = useToast();

  return (
    <div className="toast-viewport" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-icon">{ICONS[toast.type] ?? ICONS.info}</span>
          <span className="toast-message">{toast.message}</span>
          <div className="toast-progress" />
        </div>
      ))}
    </div>
  );
}
