package com.softgic.centralization.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.softgic.centralization.dto.CasoCrearDTO;
import com.softgic.centralization.dto.CasoDTO;
import com.softgic.centralization.model.Caso;
import com.softgic.centralization.model.Categoria;
import com.softgic.centralization.model.Laboratorio;
import com.softgic.centralization.model.Tecnologia;
import com.softgic.centralization.model.TipoCaso;
import com.softgic.centralization.repository.CasoRepository;
import com.softgic.centralization.repository.CategoriaRepository;
import com.softgic.centralization.repository.LaboratorioRepository;
import com.softgic.centralization.repository.TecnologiaRepository;
import com.softgic.centralization.repository.TipoCasoRepository;

@Service
public class CasoServiceImpl implements CasoService {

    private final CasoRepository casoRepository;
    private final TipoCasoRepository tipoCasoRepository;
    private final TecnologiaRepository tecnologiaRepository;
    private final CategoriaRepository categoriaRepository;
    private final LaboratorioRepository laboratorioRepository;

    public CasoServiceImpl(CasoRepository casoRepository, TipoCasoRepository tipoCasoRepository,
            TecnologiaRepository tecnologiaRepository, CategoriaRepository categoriaRepository,
            LaboratorioRepository laboratorioRepository) {
        this.casoRepository = casoRepository;
        this.tipoCasoRepository = tipoCasoRepository;
        this.tecnologiaRepository = tecnologiaRepository;
        this.categoriaRepository = categoriaRepository;
        this.laboratorioRepository = laboratorioRepository;
    }

    @Override
    public List<CasoDTO> listarTodosLosCasos() {
        List<Caso> casos = casoRepository.findAll();
        return casos.stream().map(this::convertirEDto).collect(Collectors.toList());
    }

    @Override
    public CasoDTO crearCaso(CasoCrearDTO casoCrearDTO) {
        Caso nuevoCaso = new Caso();
        nuevoCaso.setTitulo(casoCrearDTO.getTitulo());
        nuevoCaso.setDescripcion(casoCrearDTO.getDescripcion());

        TipoCaso tipo = tipoCasoRepository.findById(casoCrearDTO.getIdTipoCaso())
                .orElseThrow(() -> new RuntimeException("Tipo de caso no encontrado con ID: " + casoCrearDTO.getIdTipoCaso()));
        nuevoCaso.setTipoCaso(tipo);

        List<Tecnologia> tecnologias = tecnologiaRepository.findAllById(casoCrearDTO.getIdsTecnologias());
        nuevoCaso.setTecnologias(tecnologias);

        List<Categoria> categorias = categoriaRepository.findAllById(casoCrearDTO.getIdsCategorias());
        nuevoCaso.setCategorias(categorias);

        List<Laboratorio> laboratorios = laboratorioRepository.findAllById(casoCrearDTO.getIdsLaboratorios());
        nuevoCaso.setLaboratorios(laboratorios);

        Caso casoGuardado = casoRepository.save(nuevoCaso);

        return convertirEDto(casoGuardado);
    }

    private CasoDTO convertirEDto(Caso caso) {
        CasoDTO dto = new CasoDTO();
        dto.setId(caso.getId());
        dto.setTitulo(caso.getTitulo());
        dto.setDescripcion(caso.getDescripcion());
        dto.setFechaCreacion(caso.getFechaCreacion());
        
        dto.setTipoCaso(caso.getTipoCaso().getNombreTipo());

        dto.setTecnologias(caso.getTecnologias().stream()
                .map(Tecnologia::getNombreTecnologia).collect(Collectors.toList()));
                
        dto.setCategorias(caso.getCategorias().stream()
                .map(Categoria::getNombreCategoria).collect(Collectors.toList()));
                
        dto.setLaboratorios(caso.getLaboratorios().stream()
                .map(Laboratorio::getNombreLaboratorio).collect(Collectors.toList()));

        return dto;
    }
}