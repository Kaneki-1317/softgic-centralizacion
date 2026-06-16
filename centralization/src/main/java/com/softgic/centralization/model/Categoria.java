package com.softgic.centralization.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "categoria")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String nombreCategoria;

    @ManyToMany(mappedBy = "categorias")
    private List<Caso> casos;

    public Categoria() {
    }
    
    public Categoria(Long id, String nombreCategoria, List<Caso> casos) {
        this.id = id;
        this.nombreCategoria = nombreCategoria;
        this.casos = casos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreCategoria() {
        return nombreCategoria;
    }

    public void setNombreCategoria(String nombreCategoria) {
        this.nombreCategoria = nombreCategoria;
    }

    public List<Caso> getCasos() {
        return casos;
    }

    public void setCasos(List<Caso> casos) {
        this.casos = casos;
    }
}
