package com.softgic.centralization.filter;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.softgic.centralization.util.JwtUtil;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtUtil jwtUtil;

    private JwtAuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        filter = new JwtAuthenticationFilter(jwtUtil);
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void doFilter_sinHeaderAuthorization_noAutenticaYContinuaLaCadena() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, response, chain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals(request, chain.getRequest());
    }

    @Test
    void doFilter_headerSinPrefijoBearer_noAutentica() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Basic dXNlcjpwYXNz");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, response, chain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilter_tokenInvalidoOForjado_noAutentica() throws Exception {
        when(jwtUtil.isTokenValid("token-forjado")).thenReturn(false);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer token-forjado");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, response, chain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void doFilter_tokenValido_autenticaConElCorreoDelToken() throws Exception {
        when(jwtUtil.isTokenValid("token-valido")).thenReturn(true);
        when(jwtUtil.extractCorreo("token-valido")).thenReturn("admin@softgic.com");

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer token-valido");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, response, chain);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertEquals("admin@softgic.com", auth.getPrincipal());
        assertTrue(auth.getAuthorities().isEmpty());
    }

    @Test
    void doFilter_yaHayAutenticacionEnContexto_noLaSobrescribe() throws Exception {
        // isTokenValid=true a propósito: si no se stubbea, el mock devuelve
        // false por defecto y el test "pasaría" sin ejercitar realmente la
        // rama de "ya autenticado" que se quiere probar.
        when(jwtUtil.isTokenValid("token-valido")).thenReturn(true);

        Authentication existente = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                "otro@softgic.com", null, java.util.List.of());
        SecurityContextHolder.getContext().setAuthentication(existente);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer token-valido");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, response, chain);

        assertEquals("otro@softgic.com", SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        org.mockito.Mockito.verify(jwtUtil, org.mockito.Mockito.never()).extractCorreo(org.mockito.ArgumentMatchers.any());
    }
}
