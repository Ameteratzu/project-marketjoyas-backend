/*
  Warnings:

  - The values [PUBLICADA] on the enum `SolicitudCotizacion_estado` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `solicitudcotizacion` MODIFY `estado` ENUM('PENDIENTE', 'APROBADA', 'DENEGADA') NOT NULL DEFAULT 'PENDIENTE';
