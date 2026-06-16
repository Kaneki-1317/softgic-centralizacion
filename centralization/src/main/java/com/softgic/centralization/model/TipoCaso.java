package com.softgic.centralization.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "tipo_de_casos")
@JsonIgnoreProperties("casos")
public class TipoCaso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo")
    private Long id;

    @Column(name = "nombre_tipo",unique = true, nullable = false, length = 50)
    private String nombreTipo;

    @OneToMany(mappedBy = "tipoCaso")
    private List<Caso> casos;

    public TipoCaso() {
    }

    public TipoCaso(Long id, String nombreTipo, List<Caso> casos) {
        this.id = id;
        this.nombreTipo = nombreTipo;
        this.casos = casos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreTipo() {
        return nombreTipo;
    }

    public void setNombreTipo(String nombreTipo) {
        this.nombreTipo = nombreTipo;
    }

    public List<Caso> getCasos() {
        return casos;
    }

    public void setCasos(List<Caso> casos) {
        this.casos = casos;
    }

    
}
