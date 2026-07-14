package com.softgic.centralization.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.softgic.centralization.config.SecurityConfig;
import com.softgic.centralization.filter.JwtAuthenticationFilter;
import com.softgic.centralization.model.Admin;
import com.softgic.centralization.repository.AdminRepository;
import com.softgic.centralization.security.LoginRateLimiter;
import com.softgic.centralization.util.JwtUtil;

/**
 * Slice de MVC (no levanta datasource) con el SecurityConfig real importado
 * — así se ejercita la misma configuración de seguridad que corre en
 * producción (allowlist, rate limiter, filtro JWT), no una reimplementada
 * para el test. AdminRepository/JwtUtil/LoginRateLimiter se mockean porque
 * son la frontera con la base de datos y el estado en memoria; el
 * BCryptPasswordEncoder es el real de SecurityConfig, para probar el
 * hasheo/migración de contraseñas de verdad.
 */
@WebMvcTest(AuthController.class)
@Import({ SecurityConfig.class, JwtAuthenticationFilter.class })
@ActiveProfiles("dev")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @MockitoBean
    private AdminRepository adminRepository;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private LoginRateLimiter rateLimiter;

    // CentralizationApplication tiene @EnableCaching a nivel de aplicación;
    // @WebMvcTest lo detecta (necesita la clase @SpringBootConfiguration
    // para el bootstrap) pero no autoconfigura un CacheManager en este slice
    // — sin este mock, el contexto falla al armar la infraestructura de
    // @Cacheable aunque AuthController no cachea nada.
    @MockitoBean
    private CacheManager cacheManager;

    @Test
    void login_credencialesValidas_debeRetornar200ConToken() throws Exception {
        Admin admin = new Admin(1L, "Admin Uno", "admin@softgic.com", passwordEncoder.encode("ClaveSegura123"));

        when(rateLimiter.isBlocked(any())).thenReturn(false);
        when(adminRepository.findByCorreo("admin@softgic.com")).thenReturn(Optional.of(admin));
        when(jwtUtil.generateToken("admin@softgic.com", "Admin Uno")).thenReturn("token-generado");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"correo\":\"admin@softgic.com\",\"contrasena\":\"ClaveSegura123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token-generado"))
                .andExpect(jsonPath("$.correo").value("admin@softgic.com"))
                .andExpect(jsonPath("$.name").value("Admin Uno"));

        verify(rateLimiter).recordSuccess(any());
        verify(rateLimiter, never()).recordFailure(any());
    }

    @Test
    void login_contrasenaIncorrecta_debeRetornar401YRegistrarFallo() throws Exception {
        Admin admin = new Admin(1L, "Admin Uno", "admin@softgic.com", passwordEncoder.encode("ClaveSegura123"));

        when(rateLimiter.isBlocked(any())).thenReturn(false);
        when(adminRepository.findByCorreo("admin@softgic.com")).thenReturn(Optional.of(admin));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"correo\":\"admin@softgic.com\",\"contrasena\":\"claveIncorrecta\"}"))
                .andExpect(status().isUnauthorized());

        verify(rateLimiter).recordFailure(any());
        verify(jwtUtil, never()).generateToken(anyString(), anyString());
    }

    @Test
    void login_correoNoRegistrado_debeRetornar401() throws Exception {
        when(rateLimiter.isBlocked(any())).thenReturn(false);
        when(adminRepository.findByCorreo("noexiste@softgic.com")).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"correo\":\"noexiste@softgic.com\",\"contrasena\":\"cualquiera\"}"))
                .andExpect(status().isUnauthorized());

        verify(rateLimiter).recordFailure(any());
    }

    @Test
    void login_ipBloqueadaPorRateLimiter_debeRetornar429SinConsultarRepositorio() throws Exception {
        when(rateLimiter.isBlocked(any())).thenReturn(true);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"correo\":\"admin@softgic.com\",\"contrasena\":\"algo\"}"))
                .andExpect(status().isTooManyRequests());

        verify(adminRepository, never()).findByCorreo(any());
    }

    @Test
    void login_contrasenaLegadoEnTextoPlano_migraABcryptEnElPrimerLoginExitoso() throws Exception {
        Admin admin = new Admin(1L, "Admin Legado", "legado@softgic.com", "claveEnTextoPlano");

        when(rateLimiter.isBlocked(any())).thenReturn(false);
        when(adminRepository.findByCorreo("legado@softgic.com")).thenReturn(Optional.of(admin));
        when(jwtUtil.generateToken(any(), any())).thenReturn("token");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"correo\":\"legado@softgic.com\",\"contrasena\":\"claveEnTextoPlano\"}"))
                .andExpect(status().isOk());

        verify(adminRepository, times(1)).save(admin);
        org.junit.jupiter.api.Assertions.assertTrue(passwordEncoder.matches("claveEnTextoPlano", admin.getContrasena()));
    }

    @Test
    void login_correoVacio_debeRetornar400PorValidacion() throws Exception {
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"correo\":\"\",\"contrasena\":\"algo\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_esUnEndpointPublico_noRequiereToken() throws Exception {
        when(rateLimiter.isBlocked(any())).thenReturn(false);
        when(adminRepository.findByCorreo(any())).thenReturn(Optional.empty());

        // Sin header Authorization — si /login no fuera público, esto daría
        // 401 antes de llegar al controlador.
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"correo\":\"x@x.com\",\"contrasena\":\"x\"}"))
                .andExpect(status().isUnauthorized()); // 401 del controlador (correo no existe), no del filtro de seguridad
    }
}
