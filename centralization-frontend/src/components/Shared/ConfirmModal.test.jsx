import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmModal from "./ConfirmModal";

describe("ConfirmModal", () => {
  it("no renderiza nada cuando open es false", () => {
    const { container } = render(
      <ConfirmModal open={false} onConfirm={vi.fn()} onCancel={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("muestra título y mensaje por defecto cuando open es true", () => {
    render(<ConfirmModal open={true} onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText("¿Eliminar este caso?")).toBeInTheDocument();
    expect(screen.getByText("Esta acción no se puede deshacer.")).toBeInTheDocument();
  });

  it("permite sobrescribir título y mensaje", () => {
    render(
      <ConfirmModal
        open={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        title="Título custom"
        message="Mensaje custom"
      />,
    );
    expect(screen.getByText("Título custom")).toBeInTheDocument();
    expect(screen.getByText("Mensaje custom")).toBeInTheDocument();
  });

  it("invoca onCancel al hacer clic en 'Cancelar'", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<ConfirmModal open={true} onConfirm={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("invoca onCancel al hacer clic en el overlay", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const { container } = render(<ConfirmModal open={true} onConfirm={vi.fn()} onCancel={onCancel} />);

    await user.click(container.querySelector(".confirm-overlay"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("no invoca onCancel al hacer clic dentro del panel", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<ConfirmModal open={true} onConfirm={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByText("Esta acción no se puede deshacer."));
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("invoca onCancel al presionar Escape", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<ConfirmModal open={true} onConfirm={vi.fn()} onCancel={onCancel} />);

    await user.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("muestra estado de carga y deshabilita el botón mientras onConfirm está pendiente", async () => {
    const user = userEvent.setup();
    let resolveConfirm;
    const onConfirm = vi.fn(() => new Promise((resolve) => { resolveConfirm = resolve; }));
    render(<ConfirmModal open={true} onConfirm={onConfirm} onCancel={vi.fn()} />);

    const confirmButton = screen.getByRole("button", { name: /Sí, eliminar/ });
    await user.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /Eliminando/ })).toBeDisabled();

    resolveConfirm();
  });
});
