package com.softgic.centralization.controller;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.softgic.centralization.model.Categoria;
import com.softgic.centralization.model.Laboratorio;
import com.softgic.centralization.model.Tecnologia;
import com.softgic.centralization.model.TipoCaso;
import com.softgic.centralization.repository.CategoriaRepository;
import com.softgic.centralization.repository.LaboratorioRepository;
import com.softgic.centralization.repository.TecnologiaRepository;
import com.softgic.centralization.repository.TipoCasoRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MetadataController {

    private final TipoCasoRepository tipoCasoRepository;
    private final TecnologiaRepository tecnologiaRepository;
    private final CategoriaRepository categoriaRepository;
    private final LaboratorioRepository laboratorioRepository;

    public MetadataController(TipoCasoRepository tipoCasoRepository,
                              TecnologiaRepository tecnologiaRepository,
                              CategoriaRepository categoriaRepository,
                              LaboratorioRepository laboratorioRepository) {
        this.tipoCasoRepository = tipoCasoRepository;
        this.tecnologiaRepository = tecnologiaRepository;
        this.categoriaRepository = categoriaRepository;
        this.laboratorioRepository = laboratorioRepository;
    }

    @GetMapping("/tipos-casos")
    public List<TipoCaso> obtenerTiposCasos() {
        return tipoCasoRepository.findAll();
    }

    @GetMapping("/tecnologias")
    public List<Tecnologia> obtenerTecnologias() {
        return tecnologiaRepository.findAll();
    }

    @GetMapping("/categorias")
    public List<Categoria> obtenerCategorias() {
        return categoriaRepository.findAll();
    }

    @GetMapping("/laboratorios")
    public List<Laboratorio> obtenerLaboratorios() {
        return laboratorioRepository.findAll();
    }
}
