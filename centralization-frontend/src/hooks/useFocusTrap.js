import { useEffect } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Atrapa la navegación por Tab/Shift+Tab dentro de containerRef mientras
 * `active` es true — evita que un usuario de teclado se escape del modal
 * hacia contenido de fondo aún enfocable. No gestiona el foco inicial ni su
 * restauración al cerrar; cada modal ya lo hace con su propio useEffect.
 */
export function useFocusTrap(containerRef, active) {
  useEffect(() => {
    if (!active) return;

    function handleKeyDown(e) {
      if (e.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
        .filter((el) => el.offsetParent !== null);

      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeInside = container.contains(document.activeElement);

      if (e.shiftKey) {
        if (!activeInside || document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (!activeInside || document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, containerRef]);
}
