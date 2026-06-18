import {
  createContext,
  useContext,
  useState,
} from "react";

const ToastContext =
  createContext();

export function ToastProvider({
  children,
}) {
  const [toasts, setToasts] =
    useState([]);

  function showToast(
    message,
    type = "success"
  ) {
    const toast = {
      id: Date.now(),
      message,
      type,
    };

    setToasts((prev) => [
      ...prev,
      toast,
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter(
          (item) =>
            item.id !== toast.id
        )
      );
    }, 3000);
  }

  return (
    <ToastContext.Provider
      value={{
        showToast,
        toasts,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(
    ToastContext
  );
}