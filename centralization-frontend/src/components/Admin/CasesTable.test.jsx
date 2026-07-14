import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CasesTable from "./CasesTable";

const CASES = [
  { id: 1, titulo: "Beta", tipoCaso: "Éxito", sector: "Finanzas", cliente: "ACME", anioImplementacion: 2022, fechaCreacion: "2022-05-01" },
  { id: 2, titulo: "Alfa", tipoCaso: "Éxito", sector: "Retail", cliente: "Zeta", anioImplementacion: 2021, fechaCreacion: "2021-01-01" },
  { id: 3, titulo: "Gamma", tipoCaso: "Éxito", sector: "Salud", cliente: null, anioImplementacion: 2023, fechaCreacion: "2023-03-01" },
];

function renderTable(overrides = {}) {
  const props = {
    cases: CASES,
    onOpen: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    selectedIds: new Set(),
    onToggleSelect: vi.fn(),
    onToggleSelectAll: vi.fn(),
    ...overrides,
  };
  render(<CasesTable {...props} />);
  return props;
}

function bodyTitles() {
  return screen.getAllByRole("row").slice(1).map((row) => row.querySelector(".cases-table-title-cell").textContent);
}

describe("CasesTable", () => {
  it("renderiza una fila por caso en el orden recibido", () => {
    renderTable();
    expect(bodyTitles()).toEqual(["Beta", "Alfa", "Gamma"]);
  });

  it("muestra '—' para valores ausentes como cliente", () => {
    renderTable();
    const gammaRow = screen.getByText("Gamma").closest("tr");
    expect(gammaRow).toHaveTextContent("—");
  });

  it("ordena ascendente al primer clic en el encabezado y descendente al segundo", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Ordenar por Título" }));
    expect(bodyTitles()).toEqual(["Alfa", "Beta", "Gamma"]);

    await user.click(screen.getByRole("button", { name: "Ordenar por Título" }));
    expect(bodyTitles()).toEqual(["Gamma", "Beta", "Alfa"]);
  });

  it("un tercer clic en la misma columna vuelve al orden original", async () => {
    const user = userEvent.setup();
    renderTable();

    const sortBtn = screen.getByRole("button", { name: "Ordenar por Título" });
    await user.click(sortBtn);
    await user.click(sortBtn);
    await user.click(sortBtn);

    expect(bodyTitles()).toEqual(["Beta", "Alfa", "Gamma"]);
  });

  it("cambiar de columna reinicia el orden a ascendente", async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole("button", { name: "Ordenar por Título" }));
    await user.click(screen.getByRole("button", { name: "Ordenar por Cliente" }));

    expect(screen.getByText(/Ordenado por Cliente \(ascendente\)/)).toBeInTheDocument();
  });

  it("invoca onOpen, onEdit y onDelete con el ítem/id correcto", async () => {
    const user = userEvent.setup();
    const props = renderTable();

    const betaRow = screen.getByText("Beta").closest("tr");
    await user.click(betaRow.querySelector('[aria-label="Ver caso"]'));
    expect(props.onOpen).toHaveBeenCalledWith(CASES[0]);

    await user.click(betaRow.querySelector('[aria-label="Editar caso"]'));
    expect(props.onEdit).toHaveBeenCalledWith(CASES[0]);

    await user.click(betaRow.querySelector('[aria-label="Eliminar caso"]'));
    expect(props.onDelete).toHaveBeenCalledWith(1);
  });

  it("invoca onToggleSelect al marcar el checkbox de una fila", async () => {
    const user = userEvent.setup();
    const props = renderTable();

    await user.click(screen.getByLabelText('Seleccionar "Beta"'));
    expect(props.onToggleSelect).toHaveBeenCalledWith(1);
  });

  it("el checkbox de encabezado refleja selección total y parcial", () => {
    const { rerender } = render(
      <CasesTable
        cases={CASES}
        onOpen={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        selectedIds={new Set([1, 2, 3])}
        onToggleSelect={vi.fn()}
        onToggleSelectAll={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("Seleccionar todos los casos de esta página")).toBeChecked();

    rerender(
      <CasesTable
        cases={CASES}
        onOpen={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        selectedIds={new Set([1])}
        onToggleSelect={vi.fn()}
        onToggleSelectAll={vi.fn()}
      />,
    );
    const headerCheckbox = screen.getByLabelText("Seleccionar todos los casos de esta página");
    expect(headerCheckbox).not.toBeChecked();
    expect(headerCheckbox.indeterminate).toBe(true);
  });

  it("invoca onToggleSelectAll al hacer clic en el checkbox de encabezado", async () => {
    const user = userEvent.setup();
    const props = renderTable();

    await user.click(screen.getByLabelText("Seleccionar todos los casos de esta página"));
    expect(props.onToggleSelectAll).toHaveBeenCalledTimes(1);
  });
});
