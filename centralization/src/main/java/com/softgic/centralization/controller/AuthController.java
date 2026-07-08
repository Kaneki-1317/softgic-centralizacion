package com.softgic.centralization.controller;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.softgic.centralization.dto.LoginRequestDTO;
import com.softgic.centralization.dto.LoginResponseDTO;
import com.softgic.centralization.model.Admin;
import com.softgic.centralization.repository.AdminRepository;
import com.softgic.centralization.security.LoginRateLimiter;
import com.softgic.centralization.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;
    private final LoginRateLimiter rateLimiter;

    @Value("${app.security.trust-proxy-headers:false}")
    private boolean trustProxyHeaders;

    public AuthController(AdminRepository adminRepository,
                          JwtUtil jwtUtil,
                          BCryptPasswordEncoder passwordEncoder,
                          LoginRateLimiter rateLimiter) {
        this.adminRepository = adminRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.rateLimiter = rateLimiter;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO request,
            HttpServletRequest httpRequest) {

        String clientIp = resolveClientIp(httpRequest);

        if (rateLimiter.isBlocked(clientIp)) {
            log.warn("Intento de inicio de sesión bloqueado por límite de intentos. IP: {}", clientIp);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }

        Optional<Admin> adminOpt = adminRepository.findByCorreo(request.getCorreo());

        if (adminOpt.isEmpty()) {
            rateLimiter.recordFailure(clientIp);
            log.warn("Intento de inicio de sesión fallido: correo no registrado ('{}').", request.getCorreo());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Admin admin = adminOpt.get();

        if (!checkAndMigratePassword(admin, request.getContrasena())) {
            rateLimiter.recordFailure(clientIp);
            log.warn("Intento de inicio de sesión fallido: contraseña incorrecta para '{}'.", admin.getCorreo());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        rateLimiter.recordSuccess(clientIp);
        String token = jwtUtil.generateToken(admin.getCorreo(), admin.getName());
        log.info("Usuario '{}' inició sesión correctamente.", admin.getCorreo());
        return ResponseEntity.ok(new LoginResponseDTO(admin.getName(), admin.getCorreo(), token));
    }

    /**
     * Compara la contraseña ingresada contra la almacenada.
     * Si está en texto plano (legado), la migra a BCrypt en el primer login exitoso.
     */
    private boolean checkAndMigratePassword(Admin admin, String rawPassword) {
        String stored = admin.getContrasena();
        if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
            return passwordEncoder.matches(rawPassword, stored);
        }
        // Contraseña legado en texto plano: comparar y migrar
        if (stored.equals(rawPassword)) {
            admin.setContrasena(passwordEncoder.encode(rawPassword));
            adminRepository.save(admin);
            return true;
        }
        return false;
    }

    /**
     * X-Forwarded-For lo puede mandar cualquier cliente — solo es confiable si
     * hay un proxy/load balancer de confianza delante que lo sobrescribe antes
     * de que la petición llegue aquí. Sin esa garantía (trustProxyHeaders=false,
     * valor por defecto), usar ese header permitiría evadir el rate limiter
     * mandando un valor distinto en cada intento, así que se ignora y se usa
     * siempre la IP real de la conexión TCP.
     */
    private String resolveClientIp(HttpServletRequest request) {
        if (trustProxyHeaders) {
            String xff = request.getHeader("X-Forwarded-For");
            if (xff != null && !xff.isBlank()) {
                return xff.split(",")[0].trim();
            }
        }
        return request.getRemoteAddr();
    }
}
