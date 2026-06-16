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
@Table(name = "tecnologias")
public class Tecnologia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String nombreTecnologia;

    @ManyToMany(mappedBy = "tecnologias")
    private List<Caso> casos;

    public Tecnologia() {
    }

    public Tecnologia(Long id, String nombreTecnologia, List<Caso> casos) {
        this.id = id;
        this.nombreTecnologia = nombreTecnologia;
        this.casos = casos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreTecnologia() {
        return nombreTecnologia;
    }

    public void setNombreTecnologia(String nombreTecnologia) {
        this.nombreTecnologia = nombreTecnologia;
    }

    public List<Caso> getCasos() {
        return casos;
    }

    public void setCasos(List<Caso> casos) {
        this.casos = casos;
    }

    
}
