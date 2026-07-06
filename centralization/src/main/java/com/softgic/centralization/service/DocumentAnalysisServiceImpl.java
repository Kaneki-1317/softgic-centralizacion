package com.softgic.centralization.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.SequenceInputStream;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.Arrays;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.softgic.centralization.dto.DocumentAnalysisResultDTO;
import com.softgic.centralization.exception.N8nIntegrationException;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

@Service
public class DocumentAnalysisServiceImpl implements DocumentAnalysisService {

    private static final byte[] PDF_MAGIC_BYTES = {'%', 'P', 'D', 'F', '-'};

    private final WebClient n8nWebClient;
    private final Validator validator;
    private final long maxFileSizeBytes;
    private final long n8nTimeoutMs;

    public DocumentAnalysisServiceImpl(
            @Qualifier("n8nWebClient") WebClient n8nWebClient,
            Validator validator,
            @Value("${n8n.document-analysis.max-file-size-bytes:20971520}") long maxFileSizeBytes,
            @Value("${n8n.webhook.timeout-ms:60000}") long n8nTimeoutMs) {
        this.n8nWebClient = n8nWebClient;
        this.validator = validator;
        this.maxFileSizeBytes = maxFileSizeBytes;
        this.n8nTimeoutMs = n8nTimeoutMs;
    }

    @Override
    public DocumentAnalysisResultDTO analizar(InputStream fileStream, String filenameHeader, long contentLength) {
        validarCabeceras(contentLength);

        byte[] header = leerCabeceraPdf(fileStream);
        String filename = sanitizeFilename(filenameHeader);
        InputStream cuerpoCompleto = new SequenceInputStream(new ByteArrayInputStream(header), fileStream);

        DocumentAnalysisResultDTO resultado;
        try {
            resultado = n8nWebClient.post()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header("X-Filename", filename)
                    .body(BodyInserters.fromResource(new InputStreamResource(cuerpoCompleto)))
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, response ->
                            Mono.error(new N8nIntegrationException(
                                    "n8n rechazo la solicitud (HTTP " + response.statusCode().value() + ")")))
                    .onStatus(HttpStatusCode::is5xxServerError, response ->
                            Mono.error(new N8nIntegrationException(
                                    "n8n no pudo procesar el documento (HTTP " + response.statusCode().value() + ")")))
                    .bodyToMono(DocumentAnalysisResultDTO.class)
                    .timeout(Duration.ofMillis(n8nTimeoutMs))
                    .retryWhen(Retry.backoff(2, Duration.ofSeconds(1))
                            .filter(ex -> ex instanceof WebClientRequestException))
                    .block();
        } catch (WebClientResponseException e) {
            throw new N8nIntegrationException(
                    "Error de comunicacion con n8n (HTTP " + e.getStatusCode().value() + ")", e);
        } catch (WebClientRequestException e) {
            throw new N8nIntegrationException("No se pudo conectar con n8n", e);
        } catch (RuntimeException e) {
            if (e.getCause() instanceof TimeoutException) {
                throw new N8nIntegrationException("n8n no respondio dentro del tiempo esperado", e);
            }
            throw new N8nIntegrationException("Error inesperado al comunicarse con n8n", e);
        }

        if (resultado == null) {
            throw new N8nIntegrationException("n8n devolvio una respuesta vacia");
        }

        normalizarListas(resultado);
        validarResultado(resultado);

        return resultado;
    }

    private void validarCabeceras(long contentLength) {
        if (contentLength <= 0) {
            throw new IllegalArgumentException("El request debe declarar Content-Length");
        }
        if (contentLength > maxFileSizeBytes) {
            throw new IllegalArgumentException(
                    "El archivo supera el tamano maximo permitido (" + (maxFileSizeBytes / (1024 * 1024)) + "MB)");
        }
    }

    private byte[] leerCabeceraPdf(InputStream fileStream) {
        byte[] header = new byte[PDF_MAGIC_BYTES.length];
        int leidos;
        try {
            leidos = fileStream.readNBytes(header, 0, header.length);
        } catch (IOException e) {
            throw new N8nIntegrationException("No se pudo leer el archivo recibido", e);
        }
        if (leidos < PDF_MAGIC_BYTES.length || !Arrays.equals(header, PDF_MAGIC_BYTES)) {
            throw new IllegalArgumentException("El archivo no es un PDF valido");
        }
        return header;
    }

    private String decodeFilename(String filenameHeader) {
        if (filenameHeader == null || filenameHeader.isBlank()) {
            return null;
        }
        try {
            return URLDecoder.decode(filenameHeader, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private String sanitizeFilename(String filenameHeader) {
        String decoded = decodeFilename(filenameHeader);
        if (decoded == null) {
            return "documento.pdf";
        }
        String base = Paths.get(decoded).getFileName().toString();
        return base.replaceAll("[\\r\\n\"]", "_");
    }

    private void normalizarListas(DocumentAnalysisResultDTO resultado) {
        if (resultado.getTecnologias() == null) resultado.setTecnologias(Collections.emptyList());
        if (resultado.getCategorias() == null) resultado.setCategorias(Collections.emptyList());
        if (resultado.getLaboratorios() == null) resultado.setLaboratorios(Collections.emptyList());
    }

    private void validarResultado(DocumentAnalysisResultDTO resultado) {
        Set<ConstraintViolation<DocumentAnalysisResultDTO>> violaciones = validator.validate(resultado);
        if (!violaciones.isEmpty()) {
            String detalle = violaciones.stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining("; "));
            throw new N8nIntegrationException("Respuesta de n8n invalida: " + detalle);
        }
    }
}
