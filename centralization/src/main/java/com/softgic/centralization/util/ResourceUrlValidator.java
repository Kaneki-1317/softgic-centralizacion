package com.softgic.centralization.util;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Set;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Valida que una URL use exclusivamente esquema http o https, apoyándose en
 * java.net.URI (no en regex ni en startsWith) para evitar esquemas capaces
 * de ejecutar script en el navegador del cliente (javascript:, data:,
 * vbscript:, file:, blob:, about:, etc.).
 */
public class ResourceUrlValidator implements ConstraintValidator<ValidResourceUrl, String> {

    private static final Set<String> ESQUEMAS_PERMITIDOS = Set.of("http", "https");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // la obligatoriedad la controla @NotBlank/@NotNull si el campo lo requiere
        }

        try {
            URI uri = new URI(value.trim());
            String scheme = uri.getScheme();
            return scheme != null
                    && ESQUEMAS_PERMITIDOS.contains(scheme.toLowerCase())
                    && uri.getHost() != null
                    && !uri.getHost().isBlank();
        } catch (URISyntaxException e) {
            return false;
        }
    }
}
