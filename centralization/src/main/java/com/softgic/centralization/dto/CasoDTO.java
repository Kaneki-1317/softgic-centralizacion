package com.softgic.centralization.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CasoDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private LocalDateTime fechaCreacion;
    private String tipoCaso;
    private List<String> tecnologias;
    private List<String> categorias;
    private List<String> laboratorios;
    
    public CasoDTO() {
    }

    public CasoDTO(Long id, String titulo, String descripcion, LocalDateTime fechaCreacion, String tipoCaso,
            List<String> tecnologias, List<String> categorias, List<String> laboratorios) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fechaCreacion = fechaCreacion;
        this.tipoCaso = tipoCaso;
        this.tecnologias = tecnologias;
        this.categorias = categorias;
        this.laboratorios = laboratorios;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public void setTipoCaso(String tipoCaso) {
        this.tipoCaso = tipoCaso;
    }

    public void setTecnologias(List<String> tecnologias) {
        this.tecnologias = tecnologias;
    }

    public void setCategorias(List<String> categorias) {
        this.categorias = categorias;
    }

    public void setLaboratorios(List<String> laboratorios) {
        this.laboratorios = laboratorios;
    }
}
