package com.softgic.centralization.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softgic.centralization.model.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByCorreo(String correo);
}
