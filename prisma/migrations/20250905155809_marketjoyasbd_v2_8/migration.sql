-- AlterTable
ALTER TABLE `imagenproducto` ADD COLUMN `public_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tienda` ADD COLUMN `logoPublicId` VARCHAR(191) NULL,
    ADD COLUMN `ruc` VARCHAR(191) NULL;
