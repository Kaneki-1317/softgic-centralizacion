package com.softgic.centralization.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.softgic.centralization.model.Laboratorio;

@Repository
public interface LaboratorioRepository extends JpaRepository<Laboratorio, Long>{

    boolean existsByNombreLaboratorioIgnoreCase(String nombreLaboratorio);
}
