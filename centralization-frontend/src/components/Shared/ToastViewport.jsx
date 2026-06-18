import {
  useToast,
} from "../../context/ToastContext";

export default function ToastViewport() {
  const { toasts } =
    useToast();

  return (
    <div className="toast-viewport">

      {toasts.map(
        (toast) => (
          <div
            key={toast.id}
            className={`toast ${toast.type}`}
          >
            {toast.message}
          </div>
        )
      )}

    </div>
  );
}