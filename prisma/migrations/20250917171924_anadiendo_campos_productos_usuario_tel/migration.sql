-- AlterTable
ALTER TABLE `producto` ADD COLUMN `color` VARCHAR(191) NULL,
    ADD COLUMN `condicion` VARCHAR(191) NULL,
    ADD COLUMN `detalleCondicion` VARCHAR(191) NULL,
    ADD COLUMN `garantia` VARCHAR(191) NULL,
    ADD COLUMN `genero` VARCHAR(191) NULL,
    ADD COLUMN `modelo` VARCHAR(191) NULL,
    ADD COLUMN `paisOrigen` VARCHAR(191) NULL,
    ADD COLUMN `peso` DECIMAL(10, 3) NULL,
    ADD COLUMN `poseeNiquel` BOOLEAN NULL,
    ADD COLUMN `talla` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `usuario` MODIFY `telefono` VARCHAR(191) NULL;
