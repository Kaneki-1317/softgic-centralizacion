import SelectFilter from "./SelectFilter";

export default function FilterPanel({
  search,
  onSearchChange,
  onSearchSubmit,
  filters,
  metadata,
  onChange,
  onClear,
}) {
  return (
    <div className="filter-panel">

      <h3>Filtros</h3>

      <div className="search-row">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearchSubmit();
          }}
        />
        <button
          className="primary-button"
          onClick={onSearchSubmit}
        >
          Buscar
        </button>
      </div>

      <SelectFilter
        label="Tipo de Caso"
        value={filters.tipo}
        options={metadata.tipos}
        onChange={(tipo) =>
          onChange({
            ...filters,
            tipo,
          })
        }
      />

      <SelectFilter
        label="Tecnología"
        value={filters.tecnologia}
        options={metadata.tecnologias}
        onChange={(tecnologia) =>
          onChange({
            ...filters,
            tecnologia,
          })
        }
      />

      <SelectFilter
        label="Categoría"
        value={filters.categoria}
        options={metadata.categorias}
        onChange={(categoria) =>
          onChange({
            ...filters,
            categoria,
          })
        }
      />

      <SelectFilter
        label="Laboratorio"
        value={filters.laboratorio}
        options={metadata.laboratorios}
        onChange={(laboratorio) =>
          onChange({
            ...filters,
            laboratorio,
          })
        }
      />

      <button
        className="ghost-button"
        onClick={onClear}
      >
        Limpiar filtros
      </button>

    </div>
  );
}
