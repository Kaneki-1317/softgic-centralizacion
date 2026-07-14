package com.softgic.centralization.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.softgic.centralization.dto.ErrorResponseDTO;

/**
 * Cada handler se invoca directamente (sin levantar un MockMvc/contexto
 * Spring completo) — GlobalExceptionHandler no tiene dependencias, así que
 * esto alcanza para verificar el código de estado y la forma de la
 * respuesta de cada uno, que es exactamente lo que cambió en la Fase 2
 * (varios de estos handlers antes caían como 500 genérico).
 */
class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleEntityNotFound_debeRetornar404ConElMensajeOriginal() {
        ResponseEntity<ErrorResponseDTO> response =
                handler.handleEntityNotFound(new EntityNotFoundException("Caso no encontrado con ID: 1"));

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("NOT_FOUND", response.getBody().getError());
        assertEquals("Caso no encontrado con ID: 1", response.getBody().getMessage());
    }

    @Test
    void handleIllegalArgument_debeRetornar400() {
        ResponseEntity<ErrorResponseDTO> response =
                handler.handleIllegalArgument(new IllegalArgumentException("El archivo no es un PDF valido"));

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("BAD_REQUEST", response.getBody().getError());
        assertEquals("El archivo no es un PDF valido", response.getBody().getMessage());
    }

    @Test
    void handleN8nIntegration_debeRetornar502() {
        ResponseEntity<ErrorResponseDTO> response =
                handler.handleN8nIntegration(new N8nIntegrationException("n8n no respondio a tiempo"));

        assertEquals(HttpStatus.BAD_GATEWAY, response.getStatusCode());
        assertEquals("N8N_INTEGRATION_ERROR", response.getBody().getError());
    }

    // Antes de la Fase 2, un método HTTP no soportado en una ruta existente
    // caía en el catch-all genérico y respondía 500 en vez de 405.
    @Test
    void handleMethodNotSupported_debeRetornar405() {
        var ex = new HttpRequestMethodNotSupportedException("DELETE", List.of("GET", "POST"));

        ResponseEntity<ErrorResponseDTO> response = handler.handleMethodNotSupported(ex);

        assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
        assertEquals("METHOD_NOT_ALLOWED", response.getBody().getError());
    }

    // Antes de la Fase 2, una ruta inexistente la resolvía el
    // BasicErrorController de Spring con un JSON de forma distinta al resto
    // de la API.
    @Test
    void handleNoHandlerFound_debeRetornar404ConFormatoConsistente() {
        var ex = new NoHandlerFoundException("GET", "/api/v1/no-existe", new HttpHeaders());

        ResponseEntity<ErrorResponseDTO> response = handler.handleNoHandlerFound(ex);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("NOT_FOUND", response.getBody().getError());
        assertEquals("La ruta solicitada no existe", response.getBody().getMessage());
    }

    @Test
    void handleMediaTypeNotSupported_debeRetornar415() {
        var ex = new HttpMediaTypeNotSupportedException("Content-Type no soportado");

        ResponseEntity<ErrorResponseDTO> response = handler.handleMediaTypeNotSupported(ex);

        assertEquals(HttpStatus.UNSUPPORTED_MEDIA_TYPE, response.getStatusCode());
        assertEquals("UNSUPPORTED_MEDIA_TYPE", response.getBody().getError());
    }

    // El mensaje no debe filtrar el nombre real de la restricción de base de
    // datos violada — solo que hay un conflicto.
    @Test
    void handleDataIntegrityViolation_debeRetornar409SinExponerDetalleInterno() {
        var ex = new DataIntegrityViolationException("Duplicate entry 'Python' for key 'uk_tec_nombre'");

        ResponseEntity<ErrorResponseDTO> response = handler.handleDataIntegrityViolation(ex);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("CONFLICT", response.getBody().getError());
        assertFalse(response.getBody().getMessage().contains("uk_tec_nombre"));
    }

    // El catch-all nunca debe filtrar el mensaje real de una excepción no
    // prevista — es la última línea de defensa contra fuga de stack traces.
    @Test
    void handleRuntime_noDebeExponerElMensajeOriginal() {
        var ex = new RuntimeException("NullPointerException en CasoServiceImpl.convertirEDto");

        ResponseEntity<ErrorResponseDTO> response = handler.handleRuntime(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Error interno del servidor", response.getBody().getMessage());
        assertFalse(response.getBody().getMessage().contains("NullPointerException"));
    }

    @Test
    void handleGeneric_debeRetornar500Generico() {
        ResponseEntity<ErrorResponseDTO> response = handler.handleGeneric(new Exception("detalle interno"));

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody().getTimestamp());
        assertEquals("Error interno del servidor", response.getBody().getMessage());
    }
}
