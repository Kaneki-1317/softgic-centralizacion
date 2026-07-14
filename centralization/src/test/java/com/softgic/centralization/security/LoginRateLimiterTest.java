package com.softgic.centralization.security;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LoginRateLimiterTest {

    private LoginRateLimiter rateLimiter;

    @BeforeEach
    void setUp() {
        rateLimiter = new LoginRateLimiter();
    }

    @Test
    void isBlocked_sinIntentosPrevios_debeRetornarFalse() {
        assertFalse(rateLimiter.isBlocked("192.168.1.1"));
    }

    @Test
    void recordFailure_menosDeCincoIntentos_noDebeBloquear() {
        for (int i = 0; i < 4; i++) {
            rateLimiter.recordFailure("192.168.1.2");
        }

        assertFalse(rateLimiter.isBlocked("192.168.1.2"));
    }

    @Test
    void recordFailure_cincoIntentos_debeBloquear() {
        for (int i = 0; i < 5; i++) {
            rateLimiter.recordFailure("192.168.1.3");
        }

        assertTrue(rateLimiter.isBlocked("192.168.1.3"));
    }

    @Test
    void recordFailure_masDeCincoIntentos_sigueBloqueado() {
        for (int i = 0; i < 8; i++) {
            rateLimiter.recordFailure("192.168.1.4");
        }

        assertTrue(rateLimiter.isBlocked("192.168.1.4"));
    }

    @Test
    void recordSuccess_debeLimpiarIntentosFallidosYBloqueo() {
        for (int i = 0; i < 5; i++) {
            rateLimiter.recordFailure("192.168.1.5");
        }
        assertTrue(rateLimiter.isBlocked("192.168.1.5"));

        rateLimiter.recordSuccess("192.168.1.5");

        assertFalse(rateLimiter.isBlocked("192.168.1.5"));
    }

    @Test
    void isBlocked_clavesDistintasSonIndependientes() {
        for (int i = 0; i < 5; i++) {
            rateLimiter.recordFailure("192.168.1.6");
        }

        assertTrue(rateLimiter.isBlocked("192.168.1.6"));
        assertFalse(rateLimiter.isBlocked("192.168.1.7"));
    }

    // Válvula de seguridad contra agotamiento de memoria (ver comentario en
    // LoginRateLimiter) — no valida el reseteo exacto (dependería de orden
    // de iteración interno), solo que un volumen masivo de IPs distintas no
    // hace fallar al componente.
    @Test
    void recordFailure_volumenMasivoDeClaves_noLanzaExcepcion() {
        assertDoesNotThrow(() -> {
            for (int i = 0; i < 50_001; i++) {
                rateLimiter.recordFailure("ip-" + i);
            }
        });
    }
}
