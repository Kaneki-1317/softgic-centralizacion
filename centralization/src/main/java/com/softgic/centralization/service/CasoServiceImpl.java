package com.softgic.centralization.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.softgic.centralization.dto.CasoCrearDTO;
import com.softgic.centralization.dto.CasoDTO;
import com.softgic.centralization.dto.PaginatedCasoDTO;
import com.softgic.centralization.exception.EntityNotFoundException;
import com.softgic.centralization.model.Caso;
import com.softgic.centralization.model.Categoria;
import com.softgic.centralization.model.Laboratorio;
import com.softgic.centralization.model.Tecnologia;
import com.softgic.centralization.model.TipoCaso;
import com.softgic.centralization.repository.CasoRepository;
import com.softgic.centralization.specification.CasoSpecification;
import com.softgic.centralization.repository.CategoriaRepository;
import com.softgic.centralization.repository.LaboratorioRepository;
import com.softgic.centralization.repository.TecnologiaRepository;
import com.softgic.centralization.repository.TipoCasoRepository;

@Service
public class CasoServiceImpl implements CasoService {

    private static final Logger log = LoggerFactory.getLogger(CasoServiceImpl.class);

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
    public PaginatedCasoDTO listarCasosPaginados(int page, int size, String search,
            String tipo, String tecnologia, String categoria, String laboratorio) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Caso> pageCasos = casoRepository.findAll(
                CasoSpecification.withFilters(search, tipo, tecnologia, categoria, laboratorio),
                pageable);

        List<CasoDTO> content = pageCasos.getContent().stream()
                .map(this::convertirEDto)
                .collect(Collectors.toList());

        return new PaginatedCasoDTO(
                content,
                pageCasos.getNumber(),
                pageCasos.getTotalPages(),
                pageCasos.getTotalElements());
    }

    @Override
    public CasoDTO crearCaso(CasoCrearDTO casoCrearDTO) {
        Caso nuevoCaso = new Caso();
        aplicarDatos(nuevoCaso, casoCrearDTO);

        Caso casoGuardado = casoRepository.save(nuevoCaso);
        log.info("Caso creado correctamente. ID: {}", casoGuardado.getId());

        return convertirEDto(casoGuardado);
    }

    @Override
    public CasoDTO actualizarCaso(Long id, CasoCrearDTO casoCrearDTO) {
        Caso caso = casoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Caso no encontrado con ID: " + id));

        aplicarDatos(caso, casoCrearDTO);

        Caso casoActualizado = casoRepository.save(caso);
        log.info("Caso actualizado correctamente. ID: {}", casoActualizado.getId());

        return convertirEDto(casoActualizado);
    }

    // crearCaso y actualizarCaso aplicaban el mismo bloque de asignación de
    // campos y resolución de relaciones desde CasoCrearDTO — mismo origen,
    // mismo destino (Caso), solo cambiaba si el Caso era nuevo o existente.
    private void aplicarDatos(Caso caso, CasoCrearDTO casoCrearDTO) {
        caso.setTitulo(casoCrearDTO.getTitulo());
        caso.setSector(casoCrearDTO.getSector());
        caso.setCliente(casoCrearDTO.getCliente());
        caso.setAnioImplementacion(casoCrearDTO.getAnioImplementacion());
        caso.setBeneficioPrincipal(casoCrearDTO.getBeneficioPrincipal());
        caso.setReto(casoCrearDTO.getReto());
        caso.setResultados(casoCrearDTO.getResultados());
        caso.setRecursos(casoCrearDTO.getRecursos());

        TipoCaso tipo = tipoCasoRepository.findById(casoCrearDTO.getIdTipoCaso())
                .orElseThrow(() -> new EntityNotFoundException("Tipo de caso no encontrado con ID: " + casoCrearDTO.getIdTipoCaso()));
        caso.setTipoCaso(tipo);

        List<Tecnologia> tecnologias = tecnologiaRepository.findAllById(casoCrearDTO.getIdsTecnologias());
        caso.setTecnologias(tecnologias);

        List<Categoria> categorias = categoriaRepository.findAllById(casoCrearDTO.getIdsCategorias());
        caso.setCategorias(categorias);

        List<Laboratorio> laboratorios = laboratorioRepository.findAllById(casoCrearDTO.getIdsLaboratorios());
        caso.setLaboratorios(laboratorios);
    }

    @Override
    public void eliminarCaso(Long id) {
        casoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Caso no encontrado con ID: " + id));
        casoRepository.deleteById(id);
        log.info("Caso eliminado correctamente. ID: {}", id);
    }

    private CasoDTO convertirEDto(Caso caso) {
        CasoDTO dto = new CasoDTO();
        dto.setId(caso.getId());
        dto.setTitulo(caso.getTitulo());
        dto.setTipoCaso(caso.getTipoCaso().getNombreTipo());
        dto.setSector(caso.getSector());
        dto.setCliente(caso.getCliente());
        dto.setAnioImplementacion(caso.getAnioImplementacion());
        dto.setBeneficioPrincipal(caso.getBeneficioPrincipal());
        dto.setReto(caso.getReto());
        dto.setResultados(caso.getResultados());
        dto.setRecursos(caso.getRecursos());
        dto.setFechaCreacion(caso.getFechaCreacion());

        dto.setTecnologias(caso.getTecnologias().stream()
                .map(Tecnologia::getNombreTecnologia).collect(Collectors.toList()));

        dto.setCategorias(caso.getCategorias().stream()
                .map(Categoria::getNombreCategoria).collect(Collectors.toList()));

        dto.setLaboratorios(caso.getLaboratorios().stream()
                .map(Laboratorio::getNombreLaboratorio).collect(Collectors.toList()));

        return dto;
    }
}
