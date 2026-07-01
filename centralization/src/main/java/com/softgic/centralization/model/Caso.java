package com.softgic.centralization.model;

import java.time.LocalDateTime;
import java.util.List;

import com.softgic.centralization.dto.RecursoDTO;
import com.softgic.centralization.util.RecursoListConverter;

import org.hibernate.annotations.BatchSize;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
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

    // Renombrado en Java; columna BD sigue siendo "descripcion"
    @Column(name = "descripcion", columnDefinition = "TEXT", nullable = false)
    private String reto;

    // Renombrado en Java; columna BD sigue siendo "impacto"
    @Column(name = "impacto", columnDefinition = "TEXT")
    private String resultados;

    @Column(nullable = false, length = 100)
    private String sector;

    @Column(length = 150)
    private String cliente;

    @Column(nullable = false)
    private Integer anioImplementacion;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String beneficioPrincipal;

    @Column(columnDefinition = "TEXT")
    @Convert(converter = RecursoListConverter.class)
    private List<RecursoDTO> recursos;

    @Column(name = "Fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_tipo", nullable = false)
    private TipoCaso tipoCaso;

    @BatchSize(size = 50)
    @ManyToMany
    @JoinTable(
        name = "caso_tecnologia",
        joinColumns = @JoinColumn(name = "id_caso"),
        inverseJoinColumns = @JoinColumn(name = "id_tecnologia")
    )
    private List<Tecnologia> tecnologias;

    @BatchSize(size = 50)
    @ManyToMany
    @JoinTable(
        name = "caso_categoria",
        joinColumns = @JoinColumn(name = "id_caso"),
        inverseJoinColumns = @JoinColumn(name = "id_categoria")
    )
    private List<Categoria> categorias;

    @BatchSize(size = 50)
    @ManyToMany
    @JoinTable(
        name = "caso_laboratorio",
        joinColumns = @JoinColumn(name = "id_caso"),
        inverseJoinColumns = @JoinColumn(name = "id_laboratorio")
    )
    private List<Laboratorio> laboratorios;

    public Caso() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getReto() { return reto; }
    public void setReto(String reto) { this.reto = reto; }

    public String getResultados() { return resultados; }
    public void setResultados(String resultados) { this.resultados = resultados; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }

    public Integer getAnioImplementacion() { return anioImplementacion; }
    public void setAnioImplementacion(Integer anioImplementacion) { this.anioImplementacion = anioImplementacion; }

    public String getBeneficioPrincipal() { return beneficioPrincipal; }
    public void setBeneficioPrincipal(String beneficioPrincipal) { this.beneficioPrincipal = beneficioPrincipal; }

    public List<RecursoDTO> getRecursos() { return recursos; }
    public void setRecursos(List<RecursoDTO> recursos) { this.recursos = recursos; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public TipoCaso getTipoCaso() { return tipoCaso; }
    public void setTipoCaso(TipoCaso tipoCaso) { this.tipoCaso = tipoCaso; }

    public List<Tecnologia> getTecnologias() { return tecnologias; }
    public void setTecnologias(List<Tecnologia> tecnologias) { this.tecnologias = tecnologias; }

    public List<Categoria> getCategorias() { return categorias; }
    public void setCategorias(List<Categoria> categorias) { this.categorias = categorias; }

    public List<Laboratorio> getLaboratorios() { return laboratorios; }
    public void setLaboratorios(List<Laboratorio> laboratorios) { this.laboratorios = laboratorios; }
}
