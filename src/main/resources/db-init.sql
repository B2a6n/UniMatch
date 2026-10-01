-- ============================================
-- Archivo: db-init.sql
-- Resumen: Script SQL de inicialización.
-- Define la creación de la base de datos MySQL local y el usuario administrador
-- para el entorno de desarrollo y pruebas de UniMatch.
-- ============================================

-- db-init.sql
-- Script para crear la base de datos local MySQL usada por UniMatch

CREATE DATABASE IF NOT EXISTS unimatchDB
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'Tonagod'@'localhost' IDENTIFIED BY 'UniMatch2026';
GRANT ALL PRIVILEGES ON unimatchDB.* TO 'Tonagod'@'localhost';
FLUSH PRIVILEGES;
