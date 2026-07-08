package com.softgic.centralization.util;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

/**
 * Restringe un campo String a URLs con esquema http:// o https://.
 * Bloquea esquemas capaces de ejecutar script en el navegador
 * (javascript:, data:, vbscript:, etc.) — ver ResourceUrlValidator.
 */
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ResourceUrlValidator.class)
public @interface ValidResourceUrl {

    String message() default "La URL del recurso no es válida. Debe iniciar con http:// o https://";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
