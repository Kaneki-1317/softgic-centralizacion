import { describe, expect, it } from "vitest";
import {
  getExtension,
  isAcceptedExtension,
  validateFile,
  inferTipoFromExtension,
  MAX_FILE_SIZE_BYTES,
} from "./fileValidation";

describe("getExtension", () => {
  it("extrae la extensión en minúsculas", () => {
    expect(getExtension("documento.PDF")).toBe("pdf");
    expect(getExtension("informe.docx")).toBe("docx");
  });

  it("retorna cadena vacía si no hay extensión", () => {
    expect(getExtension("sinextension")).toBe("");
  });

  it("usa la última extensión en nombres con varios puntos", () => {
    expect(getExtension("reporte.final.v2.xlsx")).toBe("xlsx");
  });
});

describe("isAcceptedExtension", () => {
  it("acepta los formatos declarados (PDF, Office, OpenDocument)", () => {
    expect(isAcceptedExtension("doc.pdf")).toBe(true);
    expect(isAcceptedExtension("doc.docx")).toBe(true);
    expect(isAcceptedExtension("doc.xlsx")).toBe(true);
    expect(isAcceptedExtension("doc.odt")).toBe(true);
  });

  it("rechaza extensiones no soportadas", () => {
    expect(isAcceptedExtension("archivo.exe")).toBe(false);
    expect(isAcceptedExtension("imagen.png")).toBe(false);
  });
});

describe("validateFile", () => {
  function makeFile({ name = "doc.pdf", size = 1024 } = {}) {
    return { name, size };
  }

  it("es válido para un archivo de extensión y tamaño aceptados", () => {
    expect(validateFile(makeFile())).toEqual({ valid: true });
  });

  it("rechaza extensión no soportada antes que el tamaño", () => {
    expect(validateFile(makeFile({ name: "virus.exe", size: 1 })))
      .toEqual({ valid: false, reason: "unsupported_type" });
  });

  it("rechaza archivos que superan MAX_FILE_SIZE_BYTES", () => {
    expect(validateFile(makeFile({ size: MAX_FILE_SIZE_BYTES + 1 })))
      .toEqual({ valid: false, reason: "too_large" });
  });

  it("acepta un archivo justo en el límite de tamaño", () => {
    expect(validateFile(makeFile({ size: MAX_FILE_SIZE_BYTES }))).toEqual({ valid: true });
  });
});

describe("inferTipoFromExtension", () => {
  it("mapea cada extensión a uno de los 4 tipos que entiende el formulario", () => {
    expect(inferTipoFromExtension("doc.pdf")).toBe("PDF");
    expect(inferTipoFromExtension("doc.docx")).toBe("DOCX");
    expect(inferTipoFromExtension("doc.doc")).toBe("DOCX");
    expect(inferTipoFromExtension("doc.xlsx")).toBe("XLSX");
    expect(inferTipoFromExtension("doc.xls")).toBe("XLSX");
    expect(inferTipoFromExtension("doc.pptx")).toBe("PPTX");
    expect(inferTipoFromExtension("doc.odt")).toBe("DOCX");
    expect(inferTipoFromExtension("doc.ods")).toBe("XLSX");
    expect(inferTipoFromExtension("doc.odp")).toBe("PPTX");
  });

  it("usa PDF como valor por defecto para extensiones sin mapeo (ej. .txt)", () => {
    expect(inferTipoFromExtension("notas.txt")).toBe("PDF");
  });
});
