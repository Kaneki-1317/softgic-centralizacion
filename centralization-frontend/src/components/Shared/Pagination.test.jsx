import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "./Pagination";

describe("Pagination", () => {
  it("no renderiza nada si hay una sola página o menos", () => {
    const { container } = render(
      <Pagination paginaActual={0} totalPaginas={1} onPageChange={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("muestra la página actual y el total", () => {
    render(<Pagination paginaActual={2} totalPaginas={5} onPageChange={vi.fn()} />);
    expect(screen.getByText("Página 3 de 5")).toBeInTheDocument();
  });

  it("deshabilita 'Anterior' en la primera página", () => {
    render(<Pagination paginaActual={0} totalPaginas={3} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeEnabled();
  });

  it("deshabilita 'Siguiente' en la última página", () => {
    render(<Pagination paginaActual={2} totalPaginas={3} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Anterior" })).toBeEnabled();
  });

  it("invoca onPageChange con la página anterior/siguiente al hacer clic", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination paginaActual={1} totalPaginas={3} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(onPageChange).toHaveBeenCalledWith(2);

    await user.click(screen.getByRole("button", { name: "Anterior" }));
    expect(onPageChange).toHaveBeenCalledWith(0);
  });
});
