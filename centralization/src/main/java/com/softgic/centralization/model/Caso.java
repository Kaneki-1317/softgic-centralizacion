package com.softgic.centralization.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "casos")
public class Caso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_caso")
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descripcion;

    @Column(name = "Fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_tipo", nullable = false)
    private TipoCaso tipoCaso;

    @ManyToMany
    @JoinTable(
        name = "caso_tecnologia",
        joinColumns = @JoinColumn(name = "id_caso"),
        inverseJoinColumns = @JoinColumn(name = "id_tecnologia")
    )
    private List<Tecnologia> tecnologias;

    @ManyToMany
    @JoinTable(
        name = "caso_categoria",
        joinColumns = @JoinColumn(name = "id_caso"),
        inverseJoinColumns = @JoinColumn(name = "id_categoria")
    )
    private List<Categoria> categorias;

    @ManyToMany
    @JoinTable(
        name = "caso_laboratorio",
        joinColumns = @JoinColumn(name = "id_caso"),
        inverseJoinColumns = @JoinColumn(name = "id_laboratorio")
    )
    private List<Laboratorio> laboratorios;

    public Caso() {
    }

    public Caso(Long id, String titulo, String descripcion, LocalDateTime fechaCreacion, TipoCaso tipoCaso,
            List<Tecnologia> tecnologias, List<Categoria> categorias, List<Laboratorio> laboratorios) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fechaCreacion = fechaCreacion;
        this.tipoCaso = tipoCaso;
        this.tecnologias = tecnologias;
        this.categorias = categorias;
        this.laboratorios = laboratorios;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public TipoCaso getTipoCaso() {
        return tipoCaso;
    }

    public void setTipoCaso(TipoCaso tipoCaso) {
        this.tipoCaso = tipoCaso;
    }

    public List<Tecnologia> getTecnologias() {
        return tecnologias;
    }

    public void setTecnologias(List<Tecnologia> tecnologias) {
        this.tecnologias = tecnologias;
    }

    public List<Categoria> getCategorias() {
        return categorias;
    }

    public void setCategorias(List<Categoria> categorias) {
        this.categorias = categorias;
    }

    public List<Laboratorio> getLaboratorios() {
        return laboratorios;
    }

    public void setLaboratorios(List<Laboratorio> laboratorios) {
        this.laboratorios = laboratorios;
    }

    
}
