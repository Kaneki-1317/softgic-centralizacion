package com.softgic.centralization.dto;

import com.softgic.centralization.util.ValidResourceUrl;

import jakarta.validation.constraints.NotBlank;

public class RecursoDTO {

    @NotBlank(message = "El tipo de documento es obligatorio")
    private String tipo;   // PDF, PPT, XLSX, VIDEO, LINK

    @NotBlank(message = "El nombre del documento es obligatorio")
    private String nombre;

    @ValidResourceUrl
    private String url;

    public RecursoDTO() {}

    public RecursoDTO(String tipo, String nombre, String url) {
        this.tipo = tipo;
        this.nombre = nombre;
        this.url = url;
    }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
