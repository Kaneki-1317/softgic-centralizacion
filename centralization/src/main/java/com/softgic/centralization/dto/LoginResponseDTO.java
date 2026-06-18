package com.softgic.centralization.dto;

public class LoginResponseDTO {

    private String name;
    private String correo;
    private String token;

    public LoginResponseDTO() {
    }

    public LoginResponseDTO(String name, String correo, String token) {
        this.name = name;
        this.correo = correo;
        this.token = token;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
