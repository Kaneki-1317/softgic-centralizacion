package com.softgic.centralization.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CasoCrearDTO {

    @NotBlank(message = "El titulo no puede estar vacío")
    @Size(max = 150, message = "El titulo no puede superar los 150 caracteres")
    private String titulo;

    @NotBlank(message = "El tipo de caso no puede estar vacío")
    @Size(max = 100)
    private String sector;

    private String cliente;

    @NotNull(message = "El año de implementación es obligatorio")
    @Min(value = 1900, message = "El año de implementación no es válido")
    private Integer anioImplementacion;

    @NotBlank(message = "El beneficio principal no puede estar vacío")
    private String beneficioPrincipal;

    @NotBlank(message = "El reto no puede estar vacío")
    private String reto;

    private String resultados;

    @Valid
    @Size(max = 50, message = "No se pueden adjuntar más de 50 documentos por caso")
    private List<RecursoDTO> recursos;

    @NotNull(message = "Debe seleccionar un tipo de caso")
    private Long idTipoCaso;

    @NotEmpty(message = "Debe seleccionar al menos una tecnología")
    private List<Long> idsTecnologias;

    @NotEmpty(message = "Debe seleccionar al menos una categoría")
    private List<Long> idsCategorias;

    @NotEmpty(message = "Debe seleccionar al menos un laboratorio")
    private List<Long> idsLaboratorios;

    public CasoCrearDTO() {}

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

    public List<RecursoDTO> getRecursos() { return recursos; }
    public void setRecursos(List<RecursoDTO> recursos) { this.recursos = recursos; }

    public Long getIdTipoCaso() { return idTipoCaso; }
    public void setIdTipoCaso(Long idTipoCaso) { this.idTipoCaso = idTipoCaso; }

    public List<Long> getIdsTecnologias() { return idsTecnologias; }
    public void setIdsTecnologias(List<Long> idsTecnologias) { this.idsTecnologias = idsTecnologias; }

    public List<Long> getIdsCategorias() { return idsCategorias; }
    public void setIdsCategorias(List<Long> idsCategorias) { this.idsCategorias = idsCategorias; }

    public List<Long> getIdsLaboratorios() { return idsLaboratorios; }
    public void setIdsLaboratorios(List<Long> idsLaboratorios) { this.idsLaboratorios = idsLaboratorios; }
}
