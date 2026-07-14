import { describe, expect, it } from "vitest";
import { isSafeResourceUrl, buildAiChips, buildFormFromExternalShape } from "./formHelpers";

describe("isSafeResourceUrl", () => {
  it("acepta URLs http y https", () => {
    expect(isSafeResourceUrl("https://ejemplo.com/doc.pdf")).toBe(true);
    expect(isSafeResourceUrl("http://ejemplo.com")).toBe(true);
  });

  it("recorta espacios antes de validar", () => {
    expect(isSafeResourceUrl("  https://ejemplo.com/doc.pdf  ")).toBe(true);
  });

  it("rechaza esquemas peligrosos", () => {
    expect(isSafeResourceUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeResourceUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
    expect(isSafeResourceUrl("file:///etc/passwd")).toBe(false);
  });

  it("rechaza texto que no es una URL", () => {
    expect(isSafeResourceUrl("no-es-una-url")).toBe(false);
    expect(isSafeResourceUrl("")).toBe(false);
  });
});

describe("buildAiChips", () => {
  const catalogo = [
    { id: 1, label: "Python" },
    { id: 2, label: "React" },
  ];

  it("retorna arreglo vacío si no hay nombres detectados por la IA", () => {
    expect(buildAiChips(null, catalogo)).toEqual([]);
    expect(buildAiChips(undefined, catalogo)).toEqual([]);
  });

  it("marca matched=true para nombres que ya existen en el catálogo", () => {
    expect(buildAiChips(["Python"], catalogo)).toEqual([{ label: "Python", matched: true }]);
  });

  it("la comparación es tolerante a mayúsculas/minúsculas y espacios", () => {
    expect(buildAiChips(["  python  "], catalogo)).toEqual([{ label: "  python  ", matched: true }]);
  });

  it("marca matched=false para nombres que aún no existen", () => {
    expect(buildAiChips(["Kubernetes"], catalogo)).toEqual([{ label: "Kubernetes", matched: false }]);
  });

  it("preserva el orden y procesa múltiples nombres", () => {
    expect(buildAiChips(["Python", "Kubernetes", "React"], catalogo)).toEqual([
      { label: "Python", matched: true },
      { label: "Kubernetes", matched: false },
      { label: "React", matched: true },
    ]);
  });
});

describe("buildFormFromExternalShape", () => {
  const tiposCasos = [{ id: 10, nombreTipo: "Caso de Éxito" }];
  const tecnologias = [{ id: 1, label: "Python" }];
  const categorias = [{ id: 2, label: "Backend" }];
  const laboratorios = [{ id: 3, label: "Lab IA" }];

  it("resuelve nombres a IDs contra el catálogo", () => {
    const resultado = buildFormFromExternalShape(
      {
        titulo: "Caso 1",
        tipoCaso: "Caso de Éxito",
        tecnologias: ["Python"],
        categorias: ["Backend"],
        laboratorios: ["Lab IA"],
      },
      tiposCasos, tecnologias, categorias, laboratorios,
    );

    expect(resultado.idTipoCaso).toBe(10);
    expect(resultado.idsTecnologias).toEqual([1]);
    expect(resultado.idsCategorias).toEqual([2]);
    expect(resultado.idsLaboratorios).toEqual([3]);
  });

  it("ignora nombres que no coinciden con ningún ítem del catálogo", () => {
    const resultado = buildFormFromExternalShape(
      { titulo: "Caso 1", tipoCaso: "Caso de Éxito", tecnologias: ["NoExiste"] },
      tiposCasos, tecnologias, categorias, laboratorios,
    );

    expect(resultado.idsTecnologias).toEqual([]);
  });

  it("usa cadena vacía como idTipoCaso si el tipo no coincide", () => {
    const resultado = buildFormFromExternalShape(
      { titulo: "Caso 1", tipoCaso: "Tipo Inexistente" },
      tiposCasos, tecnologias, categorias, laboratorios,
    );

    expect(resultado.idTipoCaso).toBe("");
  });

  it("rellena con valores por defecto los campos ausentes", () => {
    const resultado = buildFormFromExternalShape(
      { titulo: "Caso 1", tipoCaso: "Caso de Éxito" },
      tiposCasos, tecnologias, categorias, laboratorios,
    );

    expect(resultado.cliente).toBe("");
    expect(resultado.resultados).toBe("");
    expect(resultado.recursos).toEqual([]);
  });

  it("normaliza cada recurso, usando 'PDF' como tipo por defecto", () => {
    const resultado = buildFormFromExternalShape(
      {
        titulo: "Caso 1",
        tipoCaso: "Caso de Éxito",
        recursos: [{ nombre: "Doc", url: "https://x.com" }],
      },
      tiposCasos, tecnologias, categorias, laboratorios,
    );

    expect(resultado.recursos).toEqual([{ tipo: "PDF", nombre: "Doc", url: "https://x.com" }]);
  });
});
