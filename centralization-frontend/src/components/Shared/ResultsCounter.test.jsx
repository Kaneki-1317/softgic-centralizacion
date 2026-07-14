import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ResultsCounter from "./ResultsCounter";

describe("ResultsCounter", () => {
  it("usa singular cuando total es 1", () => {
    render(<ResultsCounter total={1} />);
    expect(screen.getByText("1 caso encontrado")).toBeInTheDocument();
  });

  it("usa plural cuando total es 0", () => {
    render(<ResultsCounter total={0} />);
    expect(screen.getByText("0 casos encontrados")).toBeInTheDocument();
  });

  it("usa plural cuando total es mayor a 1", () => {
    render(<ResultsCounter total={42} />);
    expect(screen.getByText("42 casos encontrados")).toBeInTheDocument();
  });
});
