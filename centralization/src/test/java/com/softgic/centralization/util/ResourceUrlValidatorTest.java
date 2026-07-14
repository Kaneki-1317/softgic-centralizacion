package com.softgic.centralization.util;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class ResourceUrlValidatorTest {

    private final ResourceUrlValidator validator = new ResourceUrlValidator();

    @Test
    void isValid_valorNulo_debeRetornarTrue() {
        // La obligatoriedad la controla @NotBlank/@NotNull en el campo, no
        // este validador — ver comentario en ResourceUrlValidator.
        assertTrue(validator.isValid(null, null));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "https://ejemplo.com/documento.pdf",
            "http://ejemplo.com",
            "https://sub.dominio.com/ruta?query=1&otro=2",
            "https://ejemplo.com:8443/ruta",
    })
    void isValid_urlsHttpHttps_debenAceptarse(String url) {
        assertTrue(validator.isValid(url, null));
    }

    // Esquemas capaces de ejecutar script o leer archivos locales en el
    // navegador — la razón de ser de este validador (ver ValidResourceUrl).
    @ParameterizedTest
    @ValueSource(strings = {
            "javascript:alert(1)",
            "data:text/html,<script>alert(1)</script>",
            "vbscript:msgbox(1)",
            "file:///etc/passwd",
            "about:blank",
            "blob:https://ejemplo.com/uuid",
    })
    void isValid_esquemasPeligrosos_debenRechazarse(String url) {
        assertFalse(validator.isValid(url, null));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "ftp://ejemplo.com/archivo",
            "no-es-una-url",
            "",
            "   ",
    })
    void isValid_urlsNoHttpONoParseables_debenRechazarse(String url) {
        assertFalse(validator.isValid(url, null));
    }

    @Test
    void isValid_urlConEsquemaValidoPeroSinHost_debeRechazarse() {
        assertFalse(validator.isValid("https:///ruta-sin-host", null));
    }

    @Test
    void isValid_urlConEspaciosAlrededor_seRecortaAntesDeValidar() {
        assertTrue(validator.isValid("  https://ejemplo.com/doc.pdf  ", null));
    }
}
