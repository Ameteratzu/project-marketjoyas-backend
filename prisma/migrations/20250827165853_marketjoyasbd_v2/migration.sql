/*
  Warnings:

  - You are about to drop the column `vendedorId` on the `cupon` table. All the data in the column will be lost.
  - You are about to drop the column `vendedorId` on the `producto` table. All the data in the column will be lost.
  - The values [NINOS,NINAS] on the enum `Producto_estilo` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `vendedorId` on the `propuestacotizacion` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the `vendedor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dni]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tiendaId` to the `Cupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tiendaId` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tiendaId` to the `PropuestaCotizacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dni` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre_completo` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cupon` DROP FOREIGN KEY `Cupon_vendedorId_fkey`;

-- DropForeignKey
ALTER TABLE `producto` DROP FOREIGN KEY `Producto_vendedorId_fkey`;

-- DropForeignKey
ALTER TABLE `propuestacotizacion` DROP FOREIGN KEY `PropuestaCotizacion_vendedorId_fkey`;

-- DropForeignKey
ALTER TABLE `vendedor` DROP FOREIGN KEY `Vendedor_usuarioId_fkey`;

-- DropIndex
DROP INDEX `Cupon_vendedorId_fkey` ON `cupon`;

-- DropIndex
DROP INDEX `Producto_vendedorId_fkey` ON `producto`;

-- DropIndex
DROP INDEX `PropuestaCotizacion_vendedorId_fkey` ON `propuestacotizacion`;

-- AlterTable
ALTER TABLE `cupon` DROP COLUMN `vendedorId`,
    ADD COLUMN `tiendaId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `producto` DROP COLUMN `vendedorId`,
    ADD COLUMN `imagen` VARCHAR(191) NULL,
    ADD COLUMN `tiendaId` INTEGER NOT NULL,
    MODIFY `estilo` ENUM('NIÑOS', 'NIÑAS', 'HOMBRES', 'MUJERES') NULL;

-- AlterTable
ALTER TABLE `propuestacotizacion` DROP COLUMN `vendedorId`,
    ADD COLUMN `tiendaId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `nombre`,
    ADD COLUMN `dni` VARCHAR(191) NOT NULL,
    ADD COLUMN `nombre_completo` VARCHAR(191) NOT NULL,
    ADD COLUMN `tiendaId` INTEGER NULL,
    ADD COLUMN `username` VARCHAR(191) NULL,
    MODIFY `rol` ENUM('ADMIN', 'CLIENTE', 'VENDEDOR', 'TRABAJADOR') NOT NULL DEFAULT 'CLIENTE';

-- DropTable
DROP TABLE `vendedor`;

-- CreateTable
CREATE TABLE `Tienda` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `pais` VARCHAR(191) NOT NULL,
    `ciudad` VARCHAR(191) NOT NULL,
    `provincia` VARCHAR(191) NOT NULL,
    `codigoPostal` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tienda_usuarioId_key`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Suscripcion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tiendaId` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `inicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fin` DATETIME(3) NOT NULL,
    `activa` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Suscripcion_tiendaId_key`(`tiendaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_username_key` ON `Usuario`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_dni_key` ON `Usuario`(`dni`);

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tienda` ADD CONSTRAINT `Tienda_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Suscripcion` ADD CONSTRAINT `Suscripcion_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cupon` ADD CONSTRAINT `Cupon_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropuestaCotizacion` ADD CONSTRAINT `PropuestaCotizacion_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
