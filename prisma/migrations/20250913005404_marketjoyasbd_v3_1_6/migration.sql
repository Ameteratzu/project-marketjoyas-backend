-- CreateTable
CREATE TABLE `DireccionAdicional` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `direccion` VARCHAR(191) NOT NULL,
    `departamento` VARCHAR(191) NOT NULL,
    `provincia` VARCHAR(191) NOT NULL,
    `distrito` VARCHAR(191) NOT NULL,
    `tipoDireccion` VARCHAR(191) NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DireccionAdicional` ADD CONSTRAINT `DireccionAdicional_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
