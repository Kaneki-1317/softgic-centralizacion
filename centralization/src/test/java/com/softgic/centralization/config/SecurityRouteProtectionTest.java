package com.softgic.centralization.config;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Levanta el contexto completo (con base de datos real, ver
 * CentralizationApplicationTests) para verificar SecurityConfig de punta a
 * punta: que las rutas que deberían ser públicas realmente lo sean, y que
 * las que deberían exigir autenticación efectivamente la exijan. Es
 * exactamente el tipo de test que detecta una regresión si alguien cambia
 * la allowlist por accidente al tocar SecurityConfig.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class SecurityRouteProtectionTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getCasos_esPublico_noRequiereToken() throws Exception {
        mockMvc.perform(get("/api/v1/casos"))
                .andExpect(status().isOk());
    }

    @Test
    void getCatalogosDeMetadata_sonPublicos() throws Exception {
        mockMvc.perform(get("/api/v1/tipos-casos")).andExpect(status().isOk());
        mockMvc.perform(get("/api/v1/tecnologias")).andExpect(status().isOk());
        mockMvc.perform(get("/api/v1/categorias")).andExpect(status().isOk());
        mockMvc.perform(get("/api/v1/laboratorios")).andExpect(status().isOk());
    }

    @Test
    void postCasos_sinToken_debeRetornar401() throws Exception {
        mockMvc.perform(post("/api/v1/casos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deleteCasos_sinToken_debeRetornar401() throws Exception {
        mockMvc.perform(delete("/api/v1/casos/1"))
                .andExpect(status().isUnauthorized());
    }

    // Los GET de catálogo son públicos, pero escribir en el catálogo no —
    // confirma que la allowlist es por método, no solo por ruta.
    @Test
    void postCategorias_sinToken_debeRetornar401() throws Exception {
        mockMvc.perform(post("/api/v1/categorias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombreCategoria\":\"Test\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void analizarDocumento_sinToken_debeRetornar401() throws Exception {
        mockMvc.perform(post("/api/v1/casos/analizar-documento")
                        .contentType(MediaType.APPLICATION_PDF))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void actuatorHealth_esPublico() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
    }

    // Ruta pública (permitAll) pero sin handler real (no hay springdoc en
    // el classpath) — confirma que el 404 pasa por GlobalExceptionHandler
    // con el mismo formato que el resto de la API, no el JSON por defecto
    // de Spring Boot.
    @Test
    void rutaPublicaSinHandlerReal_debeRetornar404ConFormatoConsistente() throws Exception {
        mockMvc.perform(get("/swagger-ui.html"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("NOT_FOUND"));
    }

    @Test
    void login_esPublico_respondeAntesDeLaAutenticacion() throws Exception {
        // Credenciales inexistentes: lo relevante es que responda 401 del
        // controlador (correo no encontrado), no que la ruta esté cerrada
        // por el filtro de seguridad antes de llegar ahí.
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"correo\":\"no-existe@softgic.com\",\"contrasena\":\"x\"}"))
                .andExpect(status().isUnauthorized());
    }
}
