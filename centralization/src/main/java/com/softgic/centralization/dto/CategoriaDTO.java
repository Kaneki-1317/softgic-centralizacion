package com.softgic.centralization.dto;

import com.softgic.centralization.model.Categoria;

public class CategoriaDTO {

    private Long id;
    private String nombreCategoria;

    public CategoriaDTO() {}

    public CategoriaDTO(Long id, String nombreCategoria) {
        this.id = id;
        this.nombreCategoria = nombreCategoria;
    }

    public static CategoriaDTO from(Categoria entity) {
        return new CategoriaDTO(entity.getId(), entity.getNombreCategoria());
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreCategoria() { return nombreCategoria; }
    public void setNombreCategoria(String nombreCategoria) { this.nombreCategoria = nombreCategoria; }
}
