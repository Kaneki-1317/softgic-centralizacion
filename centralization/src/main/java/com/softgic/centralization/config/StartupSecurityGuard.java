package com.softgic.centralization.config;

import java.util.Set;

import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.ConfigurableEnvironment;

/**
 * Corre en el momento más temprano posible del arranque (justo después de
 * preparar el Environment, antes de que exista el ApplicationContext y por
 * lo tanto antes de que se cree cualquier bean de datasource/Flyway/Hibernate),
 * y valida las condiciones mínimas de seguridad para poder arrancar.
 *
 * 1) Perfil activo: debe ser exactamente uno de los conocidos. spring.profiles.active
 *    ya no tiene valor por defecto en application.properties, así que un despliegue
 *    sin SPRING_PROFILES_ACTIVE falla antes de este punto; este guard cubre el otro
 *    caso, un valor presente pero incorrecto (typo, mayúsculas, perfil no soportado).
 *
 * 2) DB_PASSWORD: spring.datasource.password tampoco tiene default en
 *    application.properties (para no arrancar con una contraseña adivinable como
 *    "changeme"), pero un placeholder Spring sin resolver no siempre falla el
 *    arranque de forma clara — en la práctica termina intentando conectar con una
 *    contraseña vacía/literal y falla con un genérico "Access denied" de MySQL,
 *    minutos después y sin decir por qué. Se valida aquí explícitamente para dar
 *    un mensaje inmediato y claro en su lugar.
 */
public class StartupSecurityGuard implements ApplicationListener<ApplicationEnvironmentPreparedEvent> {

    private static final Set<String> PERFILES_PERMITIDOS = Set.of("dev", "prod");

    @Override
    public void onApplicationEvent(ApplicationEnvironmentPreparedEvent event) {
        ConfigurableEnvironment environment = event.getEnvironment();
        String[] activeProfiles = environment.getActiveProfiles();

        if (activeProfiles.length != 1 || !PERFILES_PERMITIDOS.contains(activeProfiles[0])) {
            throw new IllegalStateException(
                    "Perfil activo inválido: " + String.join(",", activeProfiles)
                            + ". Debe ser exactamente uno de " + PERFILES_PERMITIDOS
                            + " (variable de entorno SPRING_PROFILES_ACTIVE).");
        }

        String dbPassword = environment.getProperty("spring.datasource.password");
        if (dbPassword == null || dbPassword.isBlank() || dbPassword.startsWith("${")) {
            throw new IllegalStateException(
                    "Falta la variable de entorno DB_PASSWORD (spring.datasource.password no se pudo resolver).");
        }
    }
}
