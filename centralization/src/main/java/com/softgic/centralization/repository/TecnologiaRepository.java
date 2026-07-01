package com.softgic.centralization.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.softgic.centralization.model.Tecnologia;

@Repository
public interface TecnologiaRepository extends JpaRepository<Tecnologia, Long>{

    boolean existsByNombreTecnologiaIgnoreCase(String nombreTecnologia);
}
