package com.softgic.centralization.security;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Component;

@Component
public class LoginRateLimiter {

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
