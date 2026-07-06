package com.softgic.centralization.exception;

public class N8nIntegrationException extends RuntimeException {

    public N8nIntegrationException(String message) {
        super(message);
    }

    public N8nIntegrationException(String message, Throwable cause) {
        super(message, cause);
    }
}
