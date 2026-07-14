import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, Pencil, Trash2, Eye } from "lucide-react";

const COLUMNS = [
  { field: "titulo", label: "Título" },
  { field: "tipoCaso", label: "Tipo" },
  { field: "sector", label: "Sector" },
  { field: "cliente", label: "Cliente" },
  { field: "anioImplementacion", label: "Año" },
  { field: "fechaCreacion", label: "Creado" },
];

function compareValues(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "es", { sensitivity: "base" });
}

function formatFecha(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("es-CO");
}

/**
 * Vista tipo tabla para el panel admin — alternativa a la grilla de tarjetas,
 * pensada para escanear y ordenar muchos casos a la vez. El backend no
 * expone un parámetro de orden (ver CasoController), así que el
 * ordenamiento por columna es local: solo reordena los casos ya cargados en
 * la página actual, no la colección completa.
 */
export default function CasesTable({ cases, onOpen, onEdit, onDelete, selectedIds, onToggleSelect, onToggleSelectAll }) {
  const [sort, setSort] = useState(null); // { field, direction: "asc" | "desc" } | null

  const sortedCases = useMemo(() => {
    if (!sort) return cases;
    const sorted = [...cases].sort((a, b) => compareValues(a[sort.field], b[sort.field]));
    return sort.direction === "desc" ? sorted.reverse() : sorted;
  }, [cases, sort]);

  function handleSort(field) {
    setSort((prev) => {
      if (!prev || prev.field !== field) return { field, direction: "asc" };
      if (prev.direction === "asc") return { field, direction: "desc" };
      return null;
    });
  }

  const allOnPageSelected = cases.length > 0 && cases.every((c) => selectedIds.has(c.id));
  const someOnPageSelected = !allOnPageSelected && cases.some((c) => selectedIds.has(c.id));
  const sortedColumnLabel = sort ? COLUMNS.find((c) => c.field === sort.field)?.label : null;

  return (
    <div className="cases-table-wrap">
      <table className="cases-table">
        <thead>
          <tr>
            <th className="cases-table-checkbox-col">
              <input
                type="checkbox"
                checked={allOnPageSelected}
                ref={(el) => { if (el) el.indeterminate = someOnPageSelected; }}
                onChange={onToggleSelectAll}
                aria-label="Seleccionar todos los casos de esta página"
              />
            </th>
            {COLUMNS.map((col) => (
              <th key={col.field}>
                <button
                  type="button"
                  className="cases-table-sort-btn"
                  onClick={() => handleSort(col.field)}
                  aria-label={`Ordenar por ${col.label}`}
                >
                  {col.label}
                  {sort?.field === col.field
                    ? (sort.direction === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />)
                    : <ArrowUpDown size={12} className="cases-table-sort-icon-idle" />}
                </button>
              </th>
            ))}
            <th className="cases-table-actions-col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedCases.map((item) => (
            <tr key={item.id} className={selectedIds.has(item.id) ? "selected" : ""}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.has(item.id)}
                  onChange={() => onToggleSelect(item.id)}
                  aria-label={`Seleccionar "${item.titulo}"`}
                />
              </td>
              <td className="cases-table-title-cell">{item.titulo}</td>
              <td>{item.tipoCaso || "—"}</td>
              <td>{item.sector || "—"}</td>
              <td>{item.cliente || "—"}</td>
              <td>{item.anioImplementacion || "—"}</td>
              <td>{formatFecha(item.fechaCreacion)}</td>
              <td className="cases-table-actions-cell">
                <button className="table-icon-btn" onClick={() => onOpen(item)} aria-label="Ver caso" title="Ver caso">
                  <Eye size={15} />
                </button>
                <button className="table-icon-btn" onClick={() => onEdit(item)} aria-label="Editar caso" title="Editar caso">
                  <Pencil size={15} />
                </button>
                <button className="table-icon-btn table-icon-btn-danger" onClick={() => onDelete(item.id)} aria-label="Eliminar caso" title="Eliminar caso">
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sort && (
        <p className="cases-table-sort-note">
          Ordenado por {sortedColumnLabel} ({sort.direction === "asc" ? "ascendente" : "descendente"}) — solo entre los casos de esta página.
        </p>
      )}
    </div>
  );
}
