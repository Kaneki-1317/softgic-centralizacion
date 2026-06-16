package com.softgic.centralization.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class CasoCrearDTO {
    @NotBlank(message = "El titulo no puede estar vacío")
    @Size(max = 150, message = "El titulo no puede superar los 150 caracteres")
    private String titulo;

    @NotBlank(message = "La descripcion no puede estar vacía")
    private String descripcion;

    @NotBlank(message = "Debe seleccionar un tipo de caso")
    private Long idTipoCaso;

    @NotEmpty(message = "Debe seleccionar al menos una tecnología")
    private List<Long> idsTecnologias;

    @NotEmpty(message = "Debe seleccionar al menos una categoría")
    private List<Long> idsCategorias;

    @NotEmpty(message = "Debe seleccionar al menos un laboratorio")
    private List<Long> idsLaboratorios;

    public CasoCrearDTO() {
    }

    public CasoCrearDTO(
            @NotBlank(message = "El titulo no puede estar vacío") @Size(max = 150, message = "El titulo no puede superar los 150 caracteres") String titulo,
            @NotBlank(message = "La descripcion no puede estar vacía") String descripcion,
            @NotBlank(message = "Debe seleccionar un tipo de caso") Long idTipoCaso,
            @NotEmpty(message = "Debe seleccionar al menos una tecnología") List<Long> idsTecnologias,
            @NotEmpty(message = "Debe seleccionar al menos una categoría") List<Long> idsCategorias,
            @NotEmpty(message = "Debe seleccionar al menos un laboratorio") List<Long> idsLaboratorios) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.idTipoCaso = idTipoCaso;
        this.idsTecnologias = idsTecnologias;
        this.idsCategorias = idsCategorias;
        this.idsLaboratorios = idsLaboratorios;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Long getIdTipoCaso() {
        return idTipoCaso;
    }

    public void setIdTipoCaso(Long idTipoCaso) {
        this.idTipoCaso = idTipoCaso;
    }

    public List<Long> getIdsTecnologias() {
        return idsTecnologias;
    }

    public void setIdsTecnologias(List<Long> idsTecnologias) {
        this.idsTecnologias = idsTecnologias;
    }

    public List<Long> getIdsCategorias() {
        return idsCategorias;
    }

    public void setIdsCategorias(List<Long> idsCategorias) {
        this.idsCategorias = idsCategorias;
    }

    public List<Long> getIdsLaboratorios() {
        return idsLaboratorios;
    }

    public void setIdsLaboratorios(List<Long> idsLaboratorios) {
        this.idsLaboratorios = idsLaboratorios;
    }

    
}
