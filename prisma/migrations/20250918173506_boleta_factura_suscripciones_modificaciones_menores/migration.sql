/*
  Warnings:

  - You are about to alter the column `tipo` on the `documento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(8))`.
  - You are about to drop the column `tipo` on the `suscripcion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pagoSId]` on the table `Suscripcion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tiendaNombre` to the `Documento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planId` to the `Suscripcion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `suscripcion` DROP FOREIGN KEY `Suscripcion_tiendaId_fkey`;

-- DropIndex
DROP INDEX `Suscripcion_tiendaId_key` ON `suscripcion`;

-- DropForeignKey adicional para producción (DIO ERROR POR ESTO)
ALTER TABLE `PropuestaCotizacion` DROP FOREIGN KEY `PropuestaCotizacion_tiendaId_fkey`;


-- AlterTable
ALTER TABLE `calificacion` ADD COLUMN `estado` ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA') NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE `documento` ADD COLUMN `clienteDocumento` VARCHAR(191) NULL,
    ADD COLUMN `clienteEmail` VARCHAR(191) NULL,
    ADD COLUMN `clienteNombre` VARCHAR(191) NULL,
    ADD COLUMN `clienteTelefono` VARCHAR(191) NULL,
    ADD COLUMN `tiendaDireccion` VARCHAR(191) NULL,
    ADD COLUMN `tiendaEmail` VARCHAR(191) NULL,
    ADD COLUMN `tiendaNombre` VARCHAR(191) NOT NULL,
    ADD COLUMN `tiendaRuc` VARCHAR(191) NULL,
    ADD COLUMN `tiendaTelefono` VARCHAR(191) NULL,
    MODIFY `tipo` ENUM('BOLETA', 'FACTURA') NOT NULL,
    MODIFY `subtotal` DECIMAL(10, 2) NULL,
    MODIFY `opGravado` DECIMAL(10, 2) NULL,
    MODIFY `igv` DECIMAL(10, 2) NULL,
    MODIFY `total` DECIMAL(10, 2) NULL,
    MODIFY `formaPago` VARCHAR(191) NULL,
    MODIFY `condVenta` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `pago` MODIFY `proveedorPago` ENUM('MERCADOPAGO', 'IZIPAY', 'STRIPE', 'YAPE', 'PLIN', 'OTRO') NOT NULL;

-- AlterTable
ALTER TABLE `pedido` ADD COLUMN `condVenta` VARCHAR(191) NULL,
    ADD COLUMN `formaPago` ENUM('CONTADO', 'CREDITO') NULL DEFAULT 'CONTADO',
    ADD COLUMN `moneda` ENUM('PEN', 'USD', 'EUR') NULL DEFAULT 'PEN',
    ADD COLUMN `tipoCambio` DECIMAL(10, 4) NULL;

-- AlterTable
ALTER TABLE `suscripcion` DROP COLUMN `tipo`,
    ADD COLUMN `pagoSId` INTEGER NULL,
    ADD COLUMN `planId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `usuario` MODIFY `rol` ENUM('SUPERADMIN', 'ADMIN', 'CLIENTE', 'DEMOVENDEDOR', 'VENDEDOR', 'TRABAJADOR') NOT NULL DEFAULT 'CLIENTE';

-- CreateTable
CREATE TABLE `PlanSuscripcion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `duracionDias` INTEGER NOT NULL,

    UNIQUE INDEX `PlanSuscripcion_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PagoSuscripcion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tiendaId` INTEGER NOT NULL,
    `proveedorPago` ENUM('MERCADOPAGO', 'IZIPAY', 'STRIPE', 'YAPE', 'PLIN', 'OTRO') NOT NULL,
    `transaccionId` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `metodoPago` VARCHAR(191) NULL,
    `monto` DECIMAL(10, 2) NOT NULL,
    `fechaPago` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `datosAdicionales` JSON NULL,

    UNIQUE INDEX `PagoSuscripcion_transaccionId_key`(`transaccionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentoDetalle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documentoId` INTEGER NOT NULL,
    `productoNombre` VARCHAR(191) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `precioUnitario` DECIMAL(10, 2) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Suscripcion_pagoSId_key` ON `Suscripcion`(`pagoSId`);

-- AddForeignKey
ALTER TABLE `Suscripcion` ADD CONSTRAINT `Suscripcion_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `PlanSuscripcion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Suscripcion` ADD CONSTRAINT `Suscripcion_pagoSId_fkey` FOREIGN KEY (`pagoSId`) REFERENCES `PagoSuscripcion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PagoSuscripcion` ADD CONSTRAINT `PagoSuscripcion_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentoDetalle` ADD CONSTRAINT `DocumentoDetalle_documentoId_fkey` FOREIGN KEY (`documentoId`) REFERENCES `Documento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
