package com.softgic.centralization.service;

import com.softgic.centralization.dto.CasoCrearDTO;
import com.softgic.centralization.dto.CasoDTO;
import com.softgic.centralization.dto.PaginatedCasoDTO;

public interface CasoService {
    PaginatedCasoDTO listarCasosPaginados(int page, int size, String search);
    CasoDTO crearCaso(CasoCrearDTO casocCrearDTO);
    CasoDTO actualizarCaso(Long id, CasoCrearDTO casoCrearDTO);
    void eliminarCaso(Long id);
}
