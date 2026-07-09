package com.softgic.centralization.dto;

import com.softgic.centralization.model.Laboratorio;

public class LaboratorioDTO {

    private Long id;
    private String nombreLaboratorio;

    public LaboratorioDTO() {}

    public LaboratorioDTO(Long id, String nombreLaboratorio) {
        this.id = id;
        this.nombreLaboratorio = nombreLaboratorio;
    }

    public static LaboratorioDTO from(Laboratorio entity) {
        return new LaboratorioDTO(entity.getId(), entity.getNombreLaboratorio());
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreLaboratorio() { return nombreLaboratorio; }
    public void setNombreLaboratorio(String nombreLaboratorio) { this.nombreLaboratorio = nombreLaboratorio; }
}
