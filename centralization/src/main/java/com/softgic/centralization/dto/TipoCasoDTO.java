package com.softgic.centralization.dto;

import com.softgic.centralization.model.TipoCaso;

public class TipoCasoDTO {

    private Long id;
    private String nombreTipo;

    public TipoCasoDTO() {}

    public TipoCasoDTO(Long id, String nombreTipo) {
        this.id = id;
        this.nombreTipo = nombreTipo;
    }

    public static TipoCasoDTO from(TipoCaso entity) {
        return new TipoCasoDTO(entity.getId(), entity.getNombreTipo());
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreTipo() { return nombreTipo; }
    public void setNombreTipo(String nombreTipo) { this.nombreTipo = nombreTipo; }
}
