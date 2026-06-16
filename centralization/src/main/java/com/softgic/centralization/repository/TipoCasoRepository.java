package com.softgic.centralization.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.softgic.centralization.model.TipoCaso;

@Repository
public interface TipoCasoRepository extends JpaRepository<TipoCaso, Long> {

}
