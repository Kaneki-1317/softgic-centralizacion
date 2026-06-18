package com.softgic.centralization.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.softgic.centralization.dto.LoginRequestDTO;
import com.softgic.centralization.dto.LoginResponseDTO;
import com.softgic.centralization.model.Admin;
import com.softgic.centralization.repository.AdminRepository;
import com.softgic.centralization.util.JwtUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;

    public AuthController(AdminRepository adminRepository, JwtUtil jwtUtil) {
        this.adminRepository = adminRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        Optional<Admin> adminOpt = adminRepository.findByCorreo(request.getCorreo());

        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Admin admin = adminOpt.get();

        if (!admin.getContrasena().equals(request.getContrasena())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = jwtUtil.generateToken(admin.getCorreo(), admin.getName());
        return ResponseEntity.ok(new LoginResponseDTO(admin.getName(), admin.getCorreo(), token));
    }
}
