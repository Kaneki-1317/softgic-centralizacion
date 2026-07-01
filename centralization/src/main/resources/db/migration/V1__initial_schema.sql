-- ══════════════════════════════════════════════════════════════════════════════
-- V1 — Esquema inicial de la aplicación
-- Este script solo se ejecuta en instalaciones NUEVAS.
-- Las bases de datos existentes son marcadas como baseline en V1 por Flyway
-- (spring.flyway.baseline-on-migrate=true, spring.flyway.baseline-version=1)
-- y este script NO se ejecuta en ellas.
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS `admin` (
    `id_admin`   BIGINT       NOT NULL AUTO_INCREMENT,
    `name`       VARCHAR(100) NOT NULL,
    `correo`     VARCHAR(100) NOT NULL,
    `contrasena` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id_admin`),
    UNIQUE KEY `uk_admin_correo` (`correo`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tipo_de_casos` (
    `id_tipo`    BIGINT      NOT NULL AUTO_INCREMENT,
    `nombre_tipo` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id_tipo`),
    UNIQUE KEY `uk_tipo_nombre` (`nombre_tipo`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tecnologias` (
    `id_tecnologia`    BIGINT      NOT NULL AUTO_INCREMENT,
    `nombre_tecnologia` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id_tecnologia`),
    UNIQUE KEY `uk_tec_nombre` (`nombre_tecnologia`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `categoria` (
    `id_categoria`    BIGINT      NOT NULL AUTO_INCREMENT,
    `nombre_categoria` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id_categoria`),
    UNIQUE KEY `uk_cat_nombre` (`nombre_categoria`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `laboratorios` (
    `id_laboratorio`    BIGINT       NOT NULL AUTO_INCREMENT,
    `nombre_laboratorio` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id_laboratorio`),
    UNIQUE KEY `uk_lab_nombre` (`nombre_laboratorio`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `casos` (
    `id_caso`              BIGINT       NOT NULL AUTO_INCREMENT,
    `titulo`               VARCHAR(150) NOT NULL,
    `descripcion`          TEXT         NOT NULL,
    `impacto`              TEXT,
    `sector`               VARCHAR(100) NOT NULL,
    `cliente`              VARCHAR(150),
    `anio_implementacion`  INT          NOT NULL,
    `beneficio_principal`  TEXT         NOT NULL,
    `recursos`             TEXT,
    `Fecha_creacion`       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    `id_tipo`              BIGINT       NOT NULL,
    PRIMARY KEY (`id_caso`),
    CONSTRAINT `fk_caso_tipo`
        FOREIGN KEY (`id_tipo`) REFERENCES `tipo_de_casos` (`id_tipo`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `caso_tecnologia` (
    `id_caso`       BIGINT NOT NULL,
    `id_tecnologia` BIGINT NOT NULL,
    PRIMARY KEY (`id_caso`, `id_tecnologia`),
    CONSTRAINT `fk_ct_caso`
        FOREIGN KEY (`id_caso`) REFERENCES `casos` (`id_caso`) ON DELETE CASCADE,
    CONSTRAINT `fk_ct_tecnologia`
        FOREIGN KEY (`id_tecnologia`) REFERENCES `tecnologias` (`id_tecnologia`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `caso_categoria` (
    `id_caso`      BIGINT NOT NULL,
    `id_categoria` BIGINT NOT NULL,
    PRIMARY KEY (`id_caso`, `id_categoria`),
    CONSTRAINT `fk_cc_caso`
        FOREIGN KEY (`id_caso`) REFERENCES `casos` (`id_caso`) ON DELETE CASCADE,
    CONSTRAINT `fk_cc_categoria`
        FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `caso_laboratorio` (
    `id_caso`        BIGINT NOT NULL,
    `id_laboratorio` BIGINT NOT NULL,
    PRIMARY KEY (`id_caso`, `id_laboratorio`),
    CONSTRAINT `fk_cl_caso`
        FOREIGN KEY (`id_caso`) REFERENCES `casos` (`id_caso`) ON DELETE CASCADE,
    CONSTRAINT `fk_cl_laboratorio`
        FOREIGN KEY (`id_laboratorio`) REFERENCES `laboratorios` (`id_laboratorio`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
