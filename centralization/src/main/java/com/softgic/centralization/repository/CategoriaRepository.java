package com.softgic.centralization.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.softgic.centralization.model.Categoria;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long>{

    boolean existsByNombreCategoriaIgnoreCase(String nombreCategoria);
}
