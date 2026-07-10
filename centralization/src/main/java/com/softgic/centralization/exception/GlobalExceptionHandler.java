package com.softgic.centralization.exception;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.softgic.centralization.dto.ErrorResponseDTO;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(N8nIntegrationException.class)
    public ResponseEntity<ErrorResponseDTO> handleN8nIntegration(N8nIntegrationException ex) {
        log.error("Fallo de integración con n8n: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(new ErrorResponseDTO(
                LocalDateTime.now().toString(),
                HttpStatus.BAD_GATEWAY.value(),
                "N8N_INTEGRATION_ERROR",
                ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .findFirst()
                .orElse("Error de validación");

        log.warn("Validación fallida en {}: {}", ex.getObjectName(), message);
        return ResponseEntity.badRequest().body(new ErrorResponseDTO(
                LocalDateTime.now().toString(),
                HttpStatus.BAD_REQUEST.value(),
                "VALIDATION_ERROR",
                message));
    }

    // Violaciones de @Validated sobre @RequestParam/@PathVariable (ej. límite
    // máximo de tamaño de página) — MethodArgumentNotValidException solo cubre
    // @Valid @RequestBody, esta es la que lanza Spring para parámetros sueltos.
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponseDTO> handleConstraintViolation(ConstraintViolationException ex) {
        String message = ex.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .findFirst()
                .orElse("Error de validación");

        log.warn("Violación de restricción: {}", message);
        return ResponseEntity.badRequest().body(new ErrorResponseDTO(
                LocalDateTime.now().toString(),
                HttpStatus.BAD_REQUEST.value(),
                "VALIDATION_ERROR",
                message));
    }

    // Parámetro con un tipo que no se puede convertir (ej. ?page=abc cuando se
    // espera un int) — sin este handler cae en el catch-all genérico y responde
    // 500 en vez de 400, aunque el error es enteramente del lado del cliente.
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponseDTO> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message = "El parámetro '" + ex.getName() + "' tiene un formato inválido";
        log.warn("Parámetro con formato inválido: '{}' = '{}'", ex.getName(), ex.getValue());
        return ResponseEntity.badRequest().body(new ErrorResponseDTO(
                LocalDateTime.now().toString(),
                HttpStatus.BAD_REQUEST.value(),
                "BAD_REQUEST",
                message));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleEntityNotFound(EntityNotFoundException ex) {
        log.warn("Entidad no encontrada: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponseDTO(
                LocalDateTime.now().toString(),
                HttpStatus.NOT_FOUND.value(),
                "NOT_FOUND",
                ex.getMessage()));
    }

    // Ruta que no coincide con ningún controlador — mismo formato de respuesta
    // que el resto de la API, en vez del JSON por defecto de Spring Boot.
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNoHandlerFound(NoHandlerFoundException ex) {
        log.warn("Ruta no encontrada: {} {}", ex.getHttpMethod(), ex.getRequestURL());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponseDTO(
                LocalDateTime.now().toString(),
                HttpStatus.NOT_FOUND.value(),
                "NOT_FOUND",
                "La ruta solicitada no existe"));
    }

    // Método HTTP no soportado en una ruta que sí existe (ej. DELETE en un
    // endpoint que solo acepta GET/POST) — sin este handler cae en el catch-all
    // genérico y responde 500 en vez de 405.
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponseDTO> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        log.warn("Método no soportado: {} (soportados: {})", ex.getMethod(), ex.getSupportedMethods());
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(new ErrorResponseDTO(
                LocalDateTime.now().toString(),
                HttpStatus.METHOD_NOT_ALLOWED.value(),
                "METHOD_NOT_ALLOWED",
                "El método " + ex.getMethod() + " no está permitido para esta ruta"));
    }

    // Content-Type no aceptado por el endpoint (ej. DocumentAnalysisController
    // solo consume application/pdf y application/octet-stream) — mismo caso que
    // los dos anteriores: sin handler específico, caía como 500 genérico.
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErrorResponseDTO> handleMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex) {
        log.warn("Content-Type no soportado: {}", ex.getContentType());
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(new ErrorResponseDTO(
                LocalDateTime.now().toString(),
                HttpStatus.UNSUPPORTED_MEDIA_TYPE.value(),
                "UNSUPPORTED_MEDIA_TYPE",
                "El tipo de contenido de la solicitud no es compatible con este endpoint"));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseDTO> handleUnreadable(HttpMessageNotReadableException ex) {
        log.warn("Cuerpo de la solicitud no legible: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(new ErrorResponseDTO(
                LocalDateTime.now().toString(),
                HttpStatus.BAD_REQUEST.value(),
                "BAD_REQUEST",
                "El cuerpo de la solicitud no es válido"));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDTO> handleIllegalArgument(IllegalArgumentException ex) {
        log.warn("Argumento inválido: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(new ErrorResponseDTO(
                LocalDateTime.now().toString(),
                HttpStatus.BAD_REQUEST.value(),
                "BAD_REQUEST",
                ex.getMessage()));
    }

    // Choque con una restricción de base de datos (ej. dos requests concurrentes
    // creando el mismo nombre único) — sin este handler cae en el catch-all
    // genérico y responde 500 en vez de 409. El mensaje no expone el detalle
    // de la restricción violada, solo que hay un conflicto con datos existentes.
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponseDTO> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        log.warn("Violación de integridad de datos: {}", ex.getMostSpecificCause().getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponseDTO(
                LocalDateTime.now().toString(),
                HttpStatus.CONFLICT.value(),
                "CONFLICT",
                "Ya existe un registro con esos datos, o la operación viola una restricción existente"));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponseDTO> handleRuntime(RuntimeException ex) {
        log.error("Error inesperado no controlado.", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponseDTO(
                LocalDateTime.now().toString(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "INTERNAL_ERROR",
                "Error interno del servidor"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGeneric(Exception ex) {
        log.error("Excepción no controlada.", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponseDTO(
                LocalDateTime.now().toString(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "INTERNAL_ERROR",
                "Error interno del servidor"));
    }
}
