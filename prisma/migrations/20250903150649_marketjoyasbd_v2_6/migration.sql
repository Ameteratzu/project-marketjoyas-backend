/*
  Warnings:

  - You are about to drop the `pedidoproducto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pedidoproducto` DROP FOREIGN KEY `PedidoProducto_pedidoId_fkey`;

-- DropForeignKey
ALTER TABLE `pedidoproducto` DROP FOREIGN KEY `PedidoProducto_productoId_fkey`;

-- DropTable
DROP TABLE `pedidoproducto`;

-- CreateTable
CREATE TABLE `CuentaOAuth` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proveedor` ENUM('GOOGLE', 'FACEBOOK') NOT NULL,
    `oauthId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    UNIQUE INDEX `CuentaOAuth_proveedor_oauthId_key`(`proveedor`, `oauthId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PedidoDetalle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedidoId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedidoId` INTEGER NOT NULL,
    `mercadoPagoId` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `metodoPago` VARCHAR(191) NULL,
    `monto` DECIMAL(10, 2) NOT NULL,
    `fechaPago` DATETIME(3) NOT NULL,
    `datosAdicionales` JSON NULL,

    UNIQUE INDEX `Pago_pedidoId_key`(`pedidoId`),
    UNIQUE INDEX `Pago_mercadoPagoId_key`(`mercadoPagoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CuentaOAuth` ADD CONSTRAINT `CuentaOAuth_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoDetalle` ADD CONSTRAINT `PedidoDetalle_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoDetalle` ADD CONSTRAINT `PedidoDetalle_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
