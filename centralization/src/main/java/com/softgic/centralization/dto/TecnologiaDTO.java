package com.softgic.centralization.dto;

import com.softgic.centralization.model.Tecnologia;

public class TecnologiaDTO {

    private Long id;
    private String nombreTecnologia;

    public TecnologiaDTO() {}

    public TecnologiaDTO(Long id, String nombreTecnologia) {
        this.id = id;
        this.nombreTecnologia = nombreTecnologia;
    }

    public static TecnologiaDTO from(Tecnologia entity) {
        return new TecnologiaDTO(entity.getId(), entity.getNombreTecnologia());
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreTecnologia() { return nombreTecnologia; }
    public void setNombreTecnologia(String nombreTecnologia) { this.nombreTecnologia = nombreTecnologia; }
}
