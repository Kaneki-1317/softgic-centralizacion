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
@Table(name = "laboratorios")
public class Laboratorio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String nombreLaboratorio;

    @ManyToMany(mappedBy = "laboratorios")
    private List<Caso> casos;

    public Laboratorio() {
    }

    public Laboratorio(Long id, String nombreLaboratorio, List<Caso> casos) {
        this.id = id;
        this.nombreLaboratorio = nombreLaboratorio;
        this.casos = casos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreLaboratorio() {
        return nombreLaboratorio;
    }

    public void setNombreLaboratorio(String nombreLaboratorio) {
        this.nombreLaboratorio = nombreLaboratorio;
    }

    public List<Caso> getCasos() {
        return casos;
    }

    public void setCasos(List<Caso> casos) {
        this.casos = casos;
    }

    
}
