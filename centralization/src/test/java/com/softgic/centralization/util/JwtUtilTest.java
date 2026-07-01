package com.softgic.centralization.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JwtUtilTest {

    // Secret de 32 bytes codificado en Base64 — solo para tests
    private static final String TEST_SECRET = "U29mdGdpY0NlbnRyYWxpemFjaW9uU2VjcmV0S2V5MjAyNDEy";
    private static final long EXPIRATION_24H = 86_400_000L;

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil(TEST_SECRET, EXPIRATION_24H);
    }

    @Test
    void generateToken_debeRetornarTokenNoNulo() {
        String token = jwtUtil.generateToken("admin@softgic.com", "Admin");
        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    void extractCorreo_debeRetornarElCorreoOriginal() {
        String correo = "test@softgic.com";
        String token = jwtUtil.generateToken(correo, "Test Admin");
        assertEquals(correo, jwtUtil.extractCorreo(token));
    }

    @Test
    void isTokenValid_conTokenValido_debeRetornarTrue() {
        String token = jwtUtil.generateToken("user@softgic.com", "Usuario");
        assertTrue(jwtUtil.isTokenValid(token));
    }

    @Test
    void isTokenValid_conTokenMalformado_debeRetornarFalse() {
        assertFalse(jwtUtil.isTokenValid("este.no.es.un.token.valido"));
    }

    @Test
    void isTokenValid_conTokenVacio_debeRetornarFalse() {
        assertFalse(jwtUtil.isTokenValid(""));
    }

    @Test
    void isTokenValid_conTokenExpirado_debeRetornarFalse() throws InterruptedException {
        JwtUtil shortLived = new JwtUtil(TEST_SECRET, 1L); // expira en 1 ms
        String token = shortLived.generateToken("user@softgic.com", "Usuario");
        Thread.sleep(20);
        assertFalse(shortLived.isTokenValid(token));
    }

    @Test
    void generateToken_tokensDiferentesParaDistintosCorreos() {
        String token1 = jwtUtil.generateToken("a@softgic.com", "A");
        String token2 = jwtUtil.generateToken("b@softgic.com", "B");
        assertFalse(token1.equals(token2));
    }
}
