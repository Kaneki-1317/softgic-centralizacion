package com.softgic.centralization.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.softgic.centralization.dto.CasoCrearDTO;
import com.softgic.centralization.dto.PaginatedCasoDTO;
import com.softgic.centralization.exception.EntityNotFoundException;
import com.softgic.centralization.model.Caso;
import com.softgic.centralization.repository.CasoRepository;
import com.softgic.centralization.repository.CategoriaRepository;
import com.softgic.centralization.repository.LaboratorioRepository;
import com.softgic.centralization.repository.TecnologiaRepository;
import com.softgic.centralization.repository.TipoCasoRepository;

@ExtendWith(MockitoExtension.class)
class CasoServiceImplTest {

    @Mock private CasoRepository casoRepository;
    @Mock private TipoCasoRepository tipoCasoRepository;
    @Mock private TecnologiaRepository tecnologiaRepository;
    @Mock private CategoriaRepository categoriaRepository;
    @Mock private LaboratorioRepository laboratorioRepository;

    @InjectMocks
    private CasoServiceImpl casoService;

    @Test
    @SuppressWarnings("unchecked")
    void listarCasosPaginados_sinCasos_debeRetornarPaginaVacia() {
        // PageImpl(List) construye un Page "unpaged" (tamaño de página = 0),
        // y ese caso especial hace que getTotalPages() devuelva 1 en vez de
        // 0. El repositorio real siempre recibe un Pageable paginado (ver
        // CasoServiceImpl: PageRequest.of(page, size)), así que el mock debe
        // reflejar eso para que el test represente el comportamiento real.
        Pageable pageable = PageRequest.of(0, 10);
        Page<Caso> emptyPage = new PageImpl<>(List.of(), pageable, 0);
        when(casoRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(emptyPage);

        PaginatedCasoDTO resultado = casoService.listarCasosPaginados(0, 10, null, null, null, null, null);

        assertNotNull(resultado);
        assertTrue(resultado.getContent().isEmpty());
        assertEquals(0, resultado.getTotalElementos());
        assertEquals(0, resultado.getTotalPaginas());
    }

    @Test
    void eliminarCaso_cuandoNoExiste_debeLanzarEntityNotFoundException() {
        when(casoRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> casoService.eliminarCaso(999L));
        verify(casoRepository, never()).deleteById(any());
    }

    @Test
    void eliminarCaso_cuandoExiste_debeEliminarCorrectamente() {
        Caso caso = new Caso();
        when(casoRepository.findById(1L)).thenReturn(Optional.of(caso));

        casoService.eliminarCaso(1L);

        verify(casoRepository).deleteById(1L);
    }

    @Test
    void crearCaso_cuandoTipoNoExiste_debeLanzarEntityNotFoundException() {
        CasoCrearDTO dto = new CasoCrearDTO();
        dto.setIdTipoCaso(99L);
        when(tipoCasoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> casoService.crearCaso(dto));
        verify(casoRepository, never()).save(any());
    }

    @Test
    void actualizarCaso_cuandoCasoNoExiste_debeLanzarEntityNotFoundException() {
        when(casoRepository.findById(404L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> casoService.actualizarCaso(404L, new CasoCrearDTO()));
        verify(casoRepository, never()).save(any());
    }
}
