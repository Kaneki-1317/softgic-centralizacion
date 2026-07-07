package com.softgic.centralization.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.NotBlank;

public class DocumentAnalysisResultDTO {

    @NotBlank(message = "n8n no devolvio 'titulo'")
    private String titulo;

    @NotBlank(message = "n8n no devolvio 'sector'")
    private String sector;

    private String cliente;

    private Integer anioImplementacion;

    @NotBlank(message = "n8n no devolvio 'beneficioPrincipal'")
    private String beneficioPrincipal;

    @NotBlank(message = "n8n no devolvio 'reto'")
    private String reto;

    private String resultados;

    private String tipoCaso;

    private List<String> tecnologias;

    // n8n históricamente ha usado "categorias"; el prompt/flujo actual puede
    // devolver "areasAplicacion" para el mismo concepto — se acepta cualquiera
    // de los dos nombres en la entrada, pero se expone siempre como
    // "categorias" hacia el frontend (sin cambiar el contrato ya consumido).
    @JsonAlias("areasAplicacion")
    private List<String> categorias;

    // Mismo caso que categorias/areasAplicacion, pero para "laboratorios" vs
    // "equipoUnidad".
    @JsonAlias("equipoUnidad")
    private List<String> laboratorios;

    public DocumentAnalysisResultDTO() {}

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }

    public Integer getAnioImplementacion() { return anioImplementacion; }
    public void setAnioImplementacion(Integer anioImplementacion) { this.anioImplementacion = anioImplementacion; }

    public String getBeneficioPrincipal() { return beneficioPrincipal; }
    public void setBeneficioPrincipal(String beneficioPrincipal) { this.beneficioPrincipal = beneficioPrincipal; }

    public String getReto() { return reto; }
    public void setReto(String reto) { this.reto = reto; }

    public String getResultados() { return resultados; }
    public void setResultados(String resultados) { this.resultados = resultados; }

    public String getTipoCaso() { return tipoCaso; }
    public void setTipoCaso(String tipoCaso) { this.tipoCaso = tipoCaso; }

    public List<String> getTecnologias() { return tecnologias; }
    public void setTecnologias(List<String> tecnologias) { this.tecnologias = tecnologias; }

    public List<String> getCategorias() { return categorias; }
    public void setCategorias(List<String> categorias) { this.categorias = categorias; }

    public List<String> getLaboratorios() { return laboratorios; }
    public void setLaboratorios(List<String> laboratorios) { this.laboratorios = laboratorios; }
}
