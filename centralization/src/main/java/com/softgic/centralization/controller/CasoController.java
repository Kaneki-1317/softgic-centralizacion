package com.softgic.centralization.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.softgic.centralization.dto.CasoCrearDTO;
import com.softgic.centralization.dto.CasoDTO;
import com.softgic.centralization.service.CasoService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


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
    public ResponseEntity<List<CasoDTO>> obtenerTodosLosCasos(){
        List<CasoDTO> casos = casoService.listarTodosLosCasos();
        return ResponseEntity.ok(casos);
    }

    @PostMapping
    public ResponseEntity<CasoDTO> guardarCaso(@Valid @RequestBody CasoCrearDTO casoCrearDTO){
        CasoDTO  nuevoCaso = casoService.crearCaso(casoCrearDTO);
        return new ResponseEntity<>(nuevoCaso, HttpStatus.ACCEPTED);
    }
    
}
