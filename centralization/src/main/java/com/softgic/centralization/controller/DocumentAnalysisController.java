package com.softgic.centralization.controller;

import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.softgic.centralization.dto.DocumentAnalysisResultDTO;
import com.softgic.centralization.service.DocumentAnalysisService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/casos")
public class DocumentAnalysisController {

    private final DocumentAnalysisService documentAnalysisService;

    public DocumentAnalysisController(DocumentAnalysisService documentAnalysisService) {
        this.documentAnalysisService = documentAnalysisService;
    }

    @PostMapping(
            value = "/analizar-documento",
            consumes = { MediaType.APPLICATION_PDF_VALUE, MediaType.APPLICATION_OCTET_STREAM_VALUE })
    public ResponseEntity<DocumentAnalysisResultDTO> analizarDocumento(
            @RequestHeader(value = "X-Filename", required = false) String filename,
            HttpServletRequest request) throws IOException {

        DocumentAnalysisResultDTO resultado = documentAnalysisService.analizar(
                request.getInputStream(),
                filename,
                request.getContentLengthLong());

        return ResponseEntity.ok(resultado);
    }
}
