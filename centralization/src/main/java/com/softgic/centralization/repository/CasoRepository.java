package com.softgic.centralization.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.softgic.centralization.model.Caso;

public interface CasoRepository extends JpaRepository<Caso, Long> {
    Page<Caso> findByTituloContainingIgnoreCase(String titulo, Pageable pageable);
}
