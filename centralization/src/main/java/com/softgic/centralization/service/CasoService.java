package com.softgic.centralization.service;

import java.util.List;

import com.softgic.centralization.dto.CasoCrearDTO;
import com.softgic.centralization.dto.CasoDTO;

public interface CasoService {
    List<CasoDTO> listarTodosLosCasos();
    CasoDTO creartCaso(CasoCrearDTO casocCrearDTO);
}
