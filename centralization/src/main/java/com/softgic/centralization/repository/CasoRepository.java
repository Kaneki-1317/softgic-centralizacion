package com.softgic.centralization.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softgic.centralization.model.Caso;

public interface CasoRepository extends JpaRepository<Caso, Long>, JpaSpecificationExecutor<Caso> {

    Page<Caso> findByTituloContainingIgnoreCase(String titulo, Pageable pageable);

    @Query("SELECT c FROM Caso c JOIN c.tecnologias t WHERE t.id = :id")
    List<Caso> findAllByTecnologiaId(@Param("id") Long id);

    @Query("SELECT c FROM Caso c JOIN c.categorias cat WHERE cat.id = :id")
    List<Caso> findAllByCategoriaId(@Param("id") Long id);

    @Query("SELECT c FROM Caso c JOIN c.laboratorios l WHERE l.id = :id")
    List<Caso> findAllByLaboratorioId(@Param("id") Long id);

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
