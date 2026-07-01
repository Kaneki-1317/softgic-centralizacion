package com.softgic.centralization.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CasoDTO {
    private Long id;
    private String titulo;
    private String tipoCaso;
    private String sector;
    private String cliente;
    private Integer anioImplementacion;
    private String beneficioPrincipal;
    private String reto;
    private String resultados;
    private List<RecursoDTO> recursos;
    private LocalDateTime fechaCreacion;
    private List<String> tecnologias;
    private List<String> categorias;
    private List<String> laboratorios;

    public CasoDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getTipoCaso() { return tipoCaso; }
    public void setTipoCaso(String tipoCaso) { this.tipoCaso = tipoCaso; }

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

    public List<RecursoDTO> getRecursos() { return recursos; }
    public void setRecursos(List<RecursoDTO> recursos) { this.recursos = recursos; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public List<String> getTecnologias() { return tecnologias; }
    public void setTecnologias(List<String> tecnologias) { this.tecnologias = tecnologias; }

    public List<String> getCategorias() { return categorias; }
    public void setCategorias(List<String> categorias) { this.categorias = categorias; }

    public List<String> getLaboratorios() { return laboratorios; }
    public void setLaboratorios(List<String> laboratorios) { this.laboratorios = laboratorios; }
}
