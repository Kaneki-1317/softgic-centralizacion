import { X } from "lucide-react";

const FILTER_LABELS = {
  tipo: "Tipo",
  tecnologia: "Tecnología",
  categoria: "Categoría",
  laboratorio: "Laboratorio",
};

/**
 * Resumen de filtros activos como chips removibles — evita tener que abrir
 * el drawer de filtros solo para ver o quitar uno. Los valores de `filters`
 * ya son las etiquetas legibles (FilterPanel/SelectFilter usa el label como
 * value del <select>), así que se muestran directo, sin resolver contra metadata.
 */
export default function ActiveFilterChips({ filters, onRemove }) {
  const active = Object.entries(filters).filter(([, value]) => value);
  if (active.length === 0) return null;

  return (
    <div className="active-filter-chips">
      {active.map(([key, value]) => (
        <span key={key} className="active-filter-chip">
          {FILTER_LABELS[key]}: {value}
          <button
            type="button"
            onClick={() => onRemove(key)}
            aria-label={`Quitar filtro ${FILTER_LABELS[key]}: ${value}`}
          >
            <X size={11} />
          </button>
        </span>
      ))}
    </div>
  );
}
