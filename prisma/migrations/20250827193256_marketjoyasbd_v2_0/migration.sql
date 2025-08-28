/*
  Warnings:

  - You are about to drop the `cotizacion` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[usuarioId,productoId]` on the table `CarritoProducto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usuarioId,productoId]` on the table `Comparacion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usuarioId,productoId]` on the table `Favorito` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `cotizacion` DROP FOREIGN KEY `Cotizacion_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `propuestacotizacion` DROP FOREIGN KEY `PropuestaCotizacion_cotizacionId_fkey`;

-- DropIndex
DROP INDEX `PropuestaCotizacion_cotizacionId_fkey` ON `propuestacotizacion`;

-- AlterTable
ALTER TABLE `cupon` ADD COLUMN `usado` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `ofertaglobal` ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE `cotizacion`;

-- CreateTable
CREATE TABLE `SolicitudCotizacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `imagenUrl` VARCHAR(191) NOT NULL,
    `estado` ENUM('PENDIENTE', 'APROBADA', 'PUBLICADA') NOT NULL DEFAULT 'PENDIENTE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `CarritoProducto_usuarioId_productoId_key` ON `CarritoProducto`(`usuarioId`, `productoId`);

-- CreateIndex
CREATE UNIQUE INDEX `Comparacion_usuarioId_productoId_key` ON `Comparacion`(`usuarioId`, `productoId`);

-- CreateIndex
CREATE UNIQUE INDEX `Favorito_usuarioId_productoId_key` ON `Favorito`(`usuarioId`, `productoId`);

-- AddForeignKey
ALTER TABLE `SolicitudCotizacion` ADD CONSTRAINT `SolicitudCotizacion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropuestaCotizacion` ADD CONSTRAINT `PropuestaCotizacion_cotizacionId_fkey` FOREIGN KEY (`cotizacionId`) REFERENCES `SolicitudCotizacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
