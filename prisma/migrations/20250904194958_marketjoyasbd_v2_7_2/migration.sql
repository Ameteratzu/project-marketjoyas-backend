-- DropForeignKey
ALTER TABLE `solicitudcotizacion` DROP FOREIGN KEY `SolicitudCotizacion_usuarioId_fkey`;

-- DropIndex
DROP INDEX `SolicitudCotizacion_usuarioId_fkey` ON `solicitudcotizacion`;

-- AlterTable
ALTER TABLE `solicitudcotizacion` MODIFY `usuarioId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `SolicitudCotizacion` ADD CONSTRAINT `SolicitudCotizacion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
