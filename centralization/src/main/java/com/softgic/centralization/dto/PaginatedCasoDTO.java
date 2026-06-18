package com.softgic.centralization.dto;

import java.util.List;

public class PaginatedCasoDTO {

    private List<CasoDTO> content;
    private int paginaActual;
    private int totalPaginas;
    private long totalElementos;

    public PaginatedCasoDTO(List<CasoDTO> content, int paginaActual, int totalPaginas, long totalElementos) {
        this.content = content;
        this.paginaActual = paginaActual;
        this.totalPaginas = totalPaginas;
        this.totalElementos = totalElementos;
    }

    public List<CasoDTO> getContent() {
        return content;
    }

    public int getPaginaActual() {
        return paginaActual;
    }

    public int getTotalPaginas() {
        return totalPaginas;
    }

    public long getTotalElementos() {
        return totalElementos;
    }
}
