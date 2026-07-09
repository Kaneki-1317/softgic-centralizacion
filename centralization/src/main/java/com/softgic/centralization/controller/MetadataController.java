package com.softgic.centralization.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.softgic.centralization.dto.CategoriaDTO;
import com.softgic.centralization.dto.LaboratorioDTO;
import com.softgic.centralization.dto.TecnologiaDTO;
import com.softgic.centralization.dto.TipoCasoDTO;
import com.softgic.centralization.model.Categoria;
import com.softgic.centralization.model.Laboratorio;
import com.softgic.centralization.model.Tecnologia;
import com.softgic.centralization.repository.CasoRepository;
import com.softgic.centralization.repository.CategoriaRepository;
import com.softgic.centralization.repository.LaboratorioRepository;
import com.softgic.centralization.repository.TecnologiaRepository;
import com.softgic.centralization.repository.TipoCasoRepository;

@RestController
@RequestMapping("/api/v1")
public class MetadataController {

    private static final Logger log = LoggerFactory.getLogger(MetadataController.class);

    private final TipoCasoRepository tipoCasoRepository;
    private final TecnologiaRepository tecnologiaRepository;
    private final CategoriaRepository categoriaRepository;
    private final LaboratorioRepository laboratorioRepository;
    private final CasoRepository casoRepository;

    public MetadataController(TipoCasoRepository tipoCasoRepository,
                              TecnologiaRepository tecnologiaRepository,
                              CategoriaRepository categoriaRepository,
                              LaboratorioRepository laboratorioRepository,
                              CasoRepository casoRepository) {
        this.tipoCasoRepository = tipoCasoRepository;
        this.tecnologiaRepository = tecnologiaRepository;
        this.categoriaRepository = categoriaRepository;
        this.laboratorioRepository = laboratorioRepository;
        this.casoRepository = casoRepository;
    }

    // ── GET endpoints — públicos, cacheados ────────────────────────────────────

    @Cacheable("tipos-casos")
    @GetMapping("/tipos-casos")
    public List<TipoCasoDTO> obtenerTiposCasos() {
        return tipoCasoRepository.findAll().stream()
                .map(TipoCasoDTO::from)
                .collect(Collectors.toList());
    }

    @Cacheable("tecnologias")
    @GetMapping("/tecnologias")
    public List<TecnologiaDTO> obtenerTecnologias() {
        return tecnologiaRepository.findAll().stream()
                .map(TecnologiaDTO::from)
                .collect(Collectors.toList());
    }

    @Cacheable("categorias")
    @GetMapping("/categorias")
    public List<CategoriaDTO> obtenerCategorias() {
        return categoriaRepository.findAll().stream()
                .map(CategoriaDTO::from)
                .collect(Collectors.toList());
    }

    @Cacheable("laboratorios")
    @GetMapping("/laboratorios")
    public List<LaboratorioDTO> obtenerLaboratorios() {
        return laboratorioRepository.findAll().stream()
                .map(LaboratorioDTO::from)
                .collect(Collectors.toList());
    }

    // ── POST endpoints — protegidos, invalidan caché ───────────────────────────

    @CacheEvict(value = "tecnologias", allEntries = true)
    @PostMapping("/tecnologias")
    public ResponseEntity<?> crearTecnologia(@RequestBody Tecnologia body) {
        String nombre = body.getNombreTecnologia();
        if (nombre == null || nombre.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "El nombre es requerido"));
        }
        nombre = nombre.trim();
        if (tecnologiaRepository.existsByNombreTecnologiaIgnoreCase(nombre)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "Ya existe una tecnología con ese nombre"));
        }
        Tecnologia nueva = new Tecnologia();
        nueva.setNombreTecnologia(nombre);
        Tecnologia guardada = tecnologiaRepository.save(nueva);
        log.info("Tecnología creada correctamente. ID: {}, nombre: '{}'", guardada.getId(), guardada.getNombreTecnologia());
        return ResponseEntity.status(HttpStatus.CREATED).body(TecnologiaDTO.from(guardada));
    }

    @CacheEvict(value = "categorias", allEntries = true)
    @PostMapping("/categorias")
    public ResponseEntity<?> crearCategoria(@RequestBody Categoria body) {
        String nombre = body.getNombreCategoria();
        if (nombre == null || nombre.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "El nombre es requerido"));
        }
        nombre = nombre.trim();
        if (categoriaRepository.existsByNombreCategoriaIgnoreCase(nombre)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "Ya existe una categoría con ese nombre"));
        }
        Categoria nueva = new Categoria();
        nueva.setNombreCategoria(nombre);
        Categoria guardada = categoriaRepository.save(nueva);
        log.info("Categoría creada correctamente. ID: {}, nombre: '{}'", guardada.getId(), guardada.getNombreCategoria());
        return ResponseEntity.status(HttpStatus.CREATED).body(CategoriaDTO.from(guardada));
    }

    @CacheEvict(value = "laboratorios", allEntries = true)
    @PostMapping("/laboratorios")
    public ResponseEntity<?> crearLaboratorio(@RequestBody Laboratorio body) {
        String nombre = body.getNombreLaboratorio();
        if (nombre == null || nombre.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "El nombre es requerido"));
        }
        nombre = nombre.trim();
        if (laboratorioRepository.existsByNombreLaboratorioIgnoreCase(nombre)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "Ya existe un equipo/unidad con ese nombre"));
        }
        Laboratorio nuevo = new Laboratorio();
        nuevo.setNombreLaboratorio(nombre);
        Laboratorio guardado = laboratorioRepository.save(nuevo);
        log.info("Equipo/unidad creado correctamente. ID: {}, nombre: '{}'", guardado.getId(), guardado.getNombreLaboratorio());
        return ResponseEntity.status(HttpStatus.CREATED).body(LaboratorioDTO.from(guardado));
    }

    // ── DELETE endpoints — protegidos, invalidan caché ─────────────────────────

    @CacheEvict(value = "tecnologias", allEntries = true)
    @Transactional
    @DeleteMapping("/tecnologias/{id}")
    public ResponseEntity<?> eliminarTecnologia(@PathVariable Long id) {
        Optional<Tecnologia> opt = tecnologiaRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        // Un solo DELETE sobre la tabla de join — reemplaza el loop N+1
        casoRepository.deleteTecnologiaFromAllCasos(id);
        tecnologiaRepository.delete(opt.get());
        log.info("Tecnología eliminada correctamente. ID: {}, nombre: '{}'", id, opt.get().getNombreTecnologia());
        return ResponseEntity.ok(Map.of("mensaje", "Tecnología eliminada correctamente"));
    }

    @CacheEvict(value = "categorias", allEntries = true)
    @Transactional
    @DeleteMapping("/categorias/{id}")
    public ResponseEntity<?> eliminarCategoria(@PathVariable Long id) {
        Optional<Categoria> opt = categoriaRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        casoRepository.deleteCategoriaFromAllCasos(id);
        categoriaRepository.delete(opt.get());
        log.info("Categoría eliminada correctamente. ID: {}, nombre: '{}'", id, opt.get().getNombreCategoria());
        return ResponseEntity.ok(Map.of("mensaje", "Categoría eliminada correctamente"));
    }

    @CacheEvict(value = "laboratorios", allEntries = true)
    @Transactional
    @DeleteMapping("/laboratorios/{id}")
    public ResponseEntity<?> eliminarLaboratorio(@PathVariable Long id) {
        Optional<Laboratorio> opt = laboratorioRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        casoRepository.deleteLaboratorioFromAllCasos(id);
        laboratorioRepository.delete(opt.get());
        log.info("Equipo/unidad eliminado correctamente. ID: {}, nombre: '{}'", id, opt.get().getNombreLaboratorio());
        return ResponseEntity.ok(Map.of("mensaje", "Equipo / unidad eliminado correctamente"));
    }
}
