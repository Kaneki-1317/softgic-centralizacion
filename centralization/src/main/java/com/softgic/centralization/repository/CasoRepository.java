package com.softgic.centralization.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softgic.centralization.model.Caso;

public interface CasoRepository extends JpaRepository<Caso, Long>, JpaSpecificationExecutor<Caso> {

    // Eliminación directa en tablas de join — reemplaza el loop N+1
    @Modifying
    @Query(value = "DELETE FROM caso_tecnologia WHERE id_tecnologia = :id", nativeQuery = true)
    void deleteTecnologiaFromAllCasos(@Param("id") Long id);

    @Modifying
    @Query(value = "DELETE FROM caso_categoria WHERE id_categoria = :id", nativeQuery = true)
    void deleteCategoriaFromAllCasos(@Param("id") Long id);

    @Modifying
    @Query(value = "DELETE FROM caso_laboratorio WHERE id_laboratorio = :id", nativeQuery = true)
    void deleteLaboratorioFromAllCasos(@Param("id") Long id);
}
