import { useEffect } from "react";
import { AlertTriangle, Settings2, LayoutList, FlaskConical, Building2, CalendarCheck, ExternalLink, TrendingUp, FileText, Paperclip } from "lucide-react";

const DOC_META = {
  PDF:  { label: "PDF",        color: "#dc2626", bg: "#fef2f2" },
  DOCX: { label: "Word",       color: "#2563eb", bg: "#eff6ff" },
  XLSX: { label: "Excel",      color: "#16a34a", bg: "#f0fdf4" },
  PPTX: { label: "PowerPoint", color: "#ea580c", bg: "#fff7ed" },
};

export default function CaseDetailModal({ item, onClose }) {
  useEffect(() => {
    if (!item) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-detail-modal-title"
      >

        <button className="modal-close" onClick={onClose} aria-label="Cerrar">&#10005;</button>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-meta">
            {item.tipoCaso && (
              <span className="modal-type-pill">
                <AlertTriangle size={13} strokeWidth={2.2} />
                {item.tipoCaso}
              </span>
            )}
            {item.sector && (
              <span className="modal-meta-chip">
                <Building2 size={13} />
                {item.sector}
              </span>
            )}
            {item.anioImplementacion && (
              <span className="modal-meta-chip">
                <CalendarCheck size={13} />
                {item.anioImplementacion}
              </span>
            )}
          </div>

          <h2 className="modal-title" id="case-detail-modal-title">{item.titulo}</h2>

          {item.cliente && (
            <p className="modal-client">Cliente: <strong>{item.cliente}</strong></p>
          )}

          {item.beneficioPrincipal && (
            <div className="modal-impact">
              <div className="modal-impact-title">
                <TrendingUp size={14} /> Beneficio principal
              </div>
              <p>{item.beneficioPrincipal}</p>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="modal-body">

          {item.reto && (
            <section className="modal-section">
              <h4 className="modal-section-label">
                <Settings2 size={13} /> Reto / Desafío
              </h4>
              <p>{item.reto}</p>
            </section>
          )}

          {item.resultados && (
            <section className="modal-section">
              <h4 className="modal-section-label">
                <TrendingUp size={13} /> Resultados obtenidos
              </h4>
              <p>{item.resultados}</p>
            </section>
          )}

          {item.tecnologias?.length > 0 && (
            <section className="modal-section">
              <h4 className="modal-section-label">
                <Settings2 size={13} /> Tecnologías
              </h4>
              <div className="modal-tags">
                {item.tecnologias.map((t) => (
                  <span key={t} className="modal-tag-pill">{t}</span>
                ))}
              </div>
            </section>
          )}

          {item.categorias?.length > 0 && (
            <section className="modal-section">
              <h4 className="modal-section-label">
                <LayoutList size={13} /> Área de aplicación
              </h4>
              <div className="modal-tags">
                {item.categorias.map((c) => (
                  <span key={c} className="modal-tag-pill">{c}</span>
                ))}
              </div>
            </section>
          )}

          {item.laboratorios?.length > 0 && (
            <section className="modal-section">
              <h4 className="modal-section-label">
                <FlaskConical size={13} /> Equipo / Unidad
              </h4>
              <div className="modal-tags">
                {item.laboratorios.map((l) => (
                  <span key={l} className="modal-tag-pill">{l}</span>
                ))}
              </div>
            </section>
          )}

          {item.recursos?.length > 0 && (
            <section className="modal-section">
              <h4 className="modal-section-label">
                <Paperclip size={13} /> Documentos del caso
              </h4>
              <div className="modal-recursos-list">
                {item.recursos.map((r, i) => {
                  const meta = DOC_META[r.tipo] || { label: r.tipo, color: "#008AAB", bg: "#e0f2f7" };
                  return (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-recurso-link"
                      style={{ "--recurso-color": meta.color, "--recurso-bg": meta.bg }}
                    >
                      <span className="modal-recurso-badge" style={{ background: meta.bg, color: meta.color }}>
                        {meta.label}
                      </span>
                      <span className="modal-recurso-info">
                        <span className="modal-recurso-nombre">{r.nombre}</span>
                        <FileText size={11} className="modal-recurso-fileicon" style={{ color: meta.color }} />
                      </span>
                      <ExternalLink size={13} className="modal-recurso-arrow" />
                    </a>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
