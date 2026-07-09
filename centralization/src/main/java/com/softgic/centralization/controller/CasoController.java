package com.softgic.centralization.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.softgic.centralization.dto.CasoCrearDTO;
import com.softgic.centralization.dto.CasoDTO;
import com.softgic.centralization.dto.PaginatedCasoDTO;
import com.softgic.centralization.service.CasoService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;

@RestController
@RequestMapping("/api/v1/casos")
@Validated
public class CasoController {

    private final CasoService casoService;

    public CasoController(CasoService casoService) {
        this.casoService = casoService;
    }

    @GetMapping
    public ResponseEntity<PaginatedCasoDTO> obtenerCasosPaginados(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") @Max(value = 100, message = "El tamaño de página no puede superar 100") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String tecnologia,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String laboratorio) {
        return ResponseEntity.ok(
            casoService.listarCasosPaginados(page, size, search, tipo, tecnologia, categoria, laboratorio));
    }

    @PostMapping
    public ResponseEntity<CasoDTO> guardarCaso(@Valid @RequestBody CasoCrearDTO casoCrearDTO) {
        CasoDTO nuevoCaso = casoService.crearCaso(casoCrearDTO);
        return new ResponseEntity<>(nuevoCaso, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CasoDTO> actualizarCaso(
            @PathVariable Long id,
            @Valid @RequestBody CasoCrearDTO casoCrearDTO) {
        CasoDTO casoActualizado = casoService.actualizarCaso(id, casoCrearDTO);
        return ResponseEntity.ok(casoActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCaso(@PathVariable Long id) {
        casoService.eliminarCaso(id);
        return ResponseEntity.noContent().build();
    }
}
