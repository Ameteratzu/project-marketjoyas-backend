-- AlterTable
ALTER TABLE `solicitudcotizacion` ADD COLUMN `contactoEmail` VARCHAR(191) NULL,
    ADD COLUMN `contactoNombre` VARCHAR(191) NULL,
    ADD COLUMN `contactoTelefono` VARCHAR(191) NULL,
    MODIFY `imagenUrl` VARCHAR(191) NULL,
    MODIFY `descripcion` VARCHAR(191) NULL;
