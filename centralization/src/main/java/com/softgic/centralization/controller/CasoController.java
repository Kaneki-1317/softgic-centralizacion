package com.softgic.centralization.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
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

@RestController
@RequestMapping("/api/casos")
@CrossOrigin(origins = "*")
@Validated
public class CasoController {

    private final CasoService casoService;

    public CasoController(CasoService casoService) {
        this.casoService = casoService;
    }

    @GetMapping
    public ResponseEntity<PaginatedCasoDTO> obtenerCasosPaginados(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search) {
        return ResponseEntity.ok(casoService.listarCasosPaginados(page, size, search));
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
