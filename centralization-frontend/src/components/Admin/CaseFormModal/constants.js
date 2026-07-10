export const DOC_TYPES = [
  { value: "PDF",  label: "PDF",         color: "#dc2626", bg: "#fef2f2" },
  { value: "DOCX", label: "Word",        color: "#2563eb", bg: "#eff6ff" },
  { value: "XLSX", label: "Excel",       color: "#16a34a", bg: "#f0fdf4" },
  { value: "PPTX", label: "PowerPoint",  color: "#ea580c", bg: "#fff7ed" },
];

export const EMPTY_FORM = {
  titulo: "",
  sector: "",
  cliente: "",
  anioImplementacion: "",
  beneficioPrincipal: "",
  reto: "",
  resultados: "",
  recursos: [],
  idTipoCaso: "",
  idsTecnologias: [],
  idsCategorias: [],
  idsLaboratorios: [],
};

export const QUICK_CONFIG = {
  tecnologia: {
    title: "Nueva Tecnología",
    placeholder: "Ej: Power BI, Salesforce, Python...",
    endpoint: "/tecnologias",
    nameField: "nombreTecnologia",
    listField: "idsTecnologias",
  },
  categoria: {
    title: "Nueva Categoría",
    placeholder: "Ej: Automatización, Analítica...",
    endpoint: "/categorias",
    nameField: "nombreCategoria",
    listField: "idsCategorias",
  },
  laboratorio: {
    title: "Nuevo Equipo / Unidad",
    placeholder: "Ej: Lab IA, Centro de Innovación...",
    endpoint: "/laboratorios",
    nameField: "nombreLaboratorio",
    listField: "idsLaboratorios",
  },
};

export const DELETE_MESSAGES = {
  tecnologia: "¿Estás seguro de que deseas eliminar esta tecnología?",
  categoria:  "¿Estás seguro de que deseas eliminar esta categoría?",
  laboratorio: "¿Estás seguro de que deseas eliminar este equipo / unidad?",
};

export const DELETE_ENDPOINTS = {
  tecnologia: "/tecnologias",
  categoria:  "/categorias",
  laboratorio: "/laboratorios",
};

export const LIST_FIELDS = {
  tecnologia: "idsTecnologias",
  categoria:  "idsCategorias",
  laboratorio: "idsLaboratorios",
};
