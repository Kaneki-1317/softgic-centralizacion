package com.softgic.centralization.dto;

public class ErrorResponseDTO {

    private String timestamp;
    private int status;
    private String error;
    private String message;

    public ErrorResponseDTO(String timestamp, int status, String error, String message) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }
}
