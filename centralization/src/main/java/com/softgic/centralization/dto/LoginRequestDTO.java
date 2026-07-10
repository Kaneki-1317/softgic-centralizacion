package com.softgic.centralization.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequestDTO {

    // 100 = mismo límite que Admin.correo (evita búsquedas/payloads con
    // valores que de antemano no podrían coincidir con ningún registro).
    @NotBlank(message = "El correo no puede estar vacío")
    @Size(max = 100, message = "El correo no es válido")
    private String correo;

    @NotBlank(message = "La contraseña no puede estar vacía")
    @Size(max = 200, message = "La contraseña no es válida")
    private String contrasena;

    public LoginRequestDTO() {
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
}
