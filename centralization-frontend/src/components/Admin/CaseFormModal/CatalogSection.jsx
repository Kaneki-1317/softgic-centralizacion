import SelectionCard from "../SelectionCard";
import PillList from "./PillList";
import SectionActions from "./SectionActions";

/**
 * Una sección de catálogo dentro del formulario de caso (Tecnologías / Área
 * de aplicación / Equipo-Unidad) — antes las 3 se escribían completas en
 * línea dentro de CaseFormModal con exactamente la misma estructura, solo
 * cambiaban los valores.
 */
export default function CatalogSection({
  icon,
  title,
  itemsLabel,
  type,
  createLabel,
  items,
  selectedIds,
  field,
  aiItems,
  creatingLabels,
  isDeleteMode,
  onToggleId,
  onAskDelete,
  onQuickCreate,
  onToggleDeleteMode,
  onCreateAiItem,
}) {
  return (
    <SelectionCard
      icon={icon}
      title={title}
      aiItems={aiItems}
      onCreateAiItem={onCreateAiItem}
      creatingLabels={creatingLabels}
    >
      <div className="section-label-row">
        <h4 className="modal-section-label">{itemsLabel}</h4>
        <SectionActions
          type={type}
          createLabel={createLabel}
          isDeleteMode={isDeleteMode}
          onQuickCreate={onQuickCreate}
          onToggleDeleteMode={onToggleDeleteMode}
        />
      </div>
      <PillList
        items={items}
        selectedIds={selectedIds}
        field={field}
        type={type}
        isDeleteMode={isDeleteMode}
        onToggle={onToggleId}
        onAskDelete={onAskDelete}
      />
    </SelectionCard>
  );
}
