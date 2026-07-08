import { useEffect, useRef } from "react";
import SelectFilter from "./SelectFilter";

export default function FilterPanel({
  open,
  onClose,
  filters,
  metadata,
  onChange,
  onClear,
}) {
  const activeCount = Object.values(filters).filter(Boolean).length;
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Al abrir, mueve el foco al drawer y recuerda qué elemento lo abrió; al
  // cerrar, devuelve el foco ahí — sin focus trap, solo estos dos momentos.
  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    return () => {
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open]);

  return (
    <>
      {open && (
        <div className="drawer-overlay" onClick={onClose} />
      )}

      <div
        id="filter-drawer"
        className={`filter-drawer ${open ? "open" : ""}`}
        role="dialog"
        aria-modal={open}
        aria-labelledby="filter-drawer-title"
        inert={!open}
      >
        <div className="drawer-header">
          <div className="drawer-header-left">
            <h3 id="filter-drawer-title">Filtros</h3>
            {activeCount > 0 && (
              <span className="drawer-active-count">{activeCount} activo{activeCount > 1 ? "s" : ""}</span>
            )}
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar filtros" ref={closeButtonRef}>&#10005;</button>
        </div>

        <div className="drawer-body">
          <SelectFilter
            label="Tipo de Caso"
            value={filters.tipo}
            options={metadata.tipos}
            onChange={(tipo) => onChange({ ...filters, tipo })}
          />

          <hr className="drawer-divider" />

          <SelectFilter
            label="Tecnología"
            value={filters.tecnologia}
            options={metadata.tecnologias}
            onChange={(tecnologia) => onChange({ ...filters, tecnologia })}
          />

          <hr className="drawer-divider" />

          <SelectFilter
            label="Categoría"
            value={filters.categoria}
            options={metadata.categorias}
            onChange={(categoria) => onChange({ ...filters, categoria })}
          />

          <hr className="drawer-divider" />

          <SelectFilter
            label="Laboratorio"
            value={filters.laboratorio}
            options={metadata.laboratorios}
            onChange={(laboratorio) => onChange({ ...filters, laboratorio })}
          />

          <button className="ghost-button full-width" style={{ marginTop: "8px" }} onClick={onClear}>
            Limpiar filtros
          </button>
        </div>
      </div>
    </>
  );
}
