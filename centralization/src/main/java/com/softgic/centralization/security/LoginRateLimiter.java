package com.softgic.centralization.security;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class LoginRateLimiter {

    private static final Logger log = LoggerFactory.getLogger(LoginRateLimiter.class);

    private static final int MAX_ATTEMPTS = 5;
    private static final long BLOCK_DURATION_MS = 15 * 60 * 1000L; // 15 minutos

    // Salvaguarda contra agotamiento de memoria: las claves que nunca llegan al
    // umbral de bloqueo (1-4 fallos, sin éxito ni bloqueo posterior) nunca se
    // limpian por sí solas. Un ataque con muchísimas IPs distintas podría hacer
    // crecer el mapa indefinidamente. Si supera este tamaño, se resetea por
    // completo — se pierde algo de precisión bajo un ataque masivo, pero se
    // evita que el propio proceso se quede sin memoria.
    private static final int MAX_TRACKED_KEYS = 50_000;

    private final ConcurrentHashMap<String, AtomicInteger> failedAttempts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> blockedUntil = new ConcurrentHashMap<>();

    public boolean isBlocked(String key) {
        Long until = blockedUntil.get(key);
        if (until == null) return false;
        if (System.currentTimeMillis() < until) return true;
        // El bloqueo venció — limpiar estado
        blockedUntil.remove(key);
        failedAttempts.remove(key);
        return false;
    }

    public void recordFailure(String key) {
        if (failedAttempts.size() >= MAX_TRACKED_KEYS) {
            // Este umbral solo se alcanza con intentos fallidos desde una
            // cantidad enorme de IPs distintas — señal de un ataque
            // distribuido, vale la pena que quede visible en el log.
            log.warn("LoginRateLimiter alcanzó MAX_TRACKED_KEYS ({}) y reseteó su estado de intentos fallidos.", MAX_TRACKED_KEYS);
            failedAttempts.clear();
        }

        int attempts = failedAttempts
                .computeIfAbsent(key, k -> new AtomicInteger(0))
                .incrementAndGet();
        if (attempts >= MAX_ATTEMPTS) {
            blockedUntil.put(key, System.currentTimeMillis() + BLOCK_DURATION_MS);
        }
    }

    public void recordSuccess(String key) {
        failedAttempts.remove(key);
        blockedUntil.remove(key);
    }
}
