/*
  Warnings:

  - Added the required column `tiendaId` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pedido` ADD COLUMN `tiendaId` INTEGER NOT NULL,
    MODIFY `estado` ENUM('PENDIENTE', 'EMPAQUETADO', 'DESPACHO', 'ENVIO', 'ENTREGA') NOT NULL DEFAULT 'PENDIENTE',
    MODIFY `codigoSeguimiento` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tienda` ADD COLUMN `emailTienda` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `razonSocial` VARCHAR(191) NULL,
    ADD COLUMN `tipoDocumento` ENUM('DNI', 'RUC', 'CE', 'OTRO') NULL DEFAULT 'DNI';

-- CreateTable
CREATE TABLE `CertificadoJoya` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tiendaId` INTEGER NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `productoNombre` VARCHAR(191) NOT NULL,
    `gemaId` INTEGER NOT NULL,
    `materialId` INTEGER NOT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `imagenUrl` VARCHAR(191) NULL,
    `fechaEmision` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Documento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `serie` VARCHAR(191) NOT NULL,
    `fechaEmision` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `moneda` ENUM('PEN', 'USD', 'EUR') NOT NULL DEFAULT 'PEN',
    `tipoCambio` DECIMAL(10, 4) NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `opGravado` DECIMAL(10, 2) NOT NULL,
    `igv` DECIMAL(10, 2) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `formaPago` VARCHAR(191) NOT NULL,
    `condVenta` VARCHAR(191) NOT NULL,
    `pedidoId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `tiendaId` INTEGER NOT NULL,
    `estadoSunat` VARCHAR(191) NULL,
    `codigoSunat` VARCHAR(191) NULL,
    `descripcionSunat` VARCHAR(191) NULL,
    `hashDocumento` VARCHAR(191) NULL,
    `xmlRuta` VARCHAR(191) NULL,
    `zipRuta` VARCHAR(191) NULL,
    `cdrRuta` VARCHAR(191) NULL,
    `pdfRuta` VARCHAR(191) NULL,
    `modoEmision` VARCHAR(191) NULL,
    `fechaEnvio` DATETIME(3) NULL,

    UNIQUE INDEX `Documento_numero_key`(`numero`),
    UNIQUE INDEX `Documento_pedidoId_key`(`pedidoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CertificadoDigital` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tiendaId` INTEGER NOT NULL,
    `certificado` LONGBLOB NOT NULL,
    `contraseña` VARCHAR(191) NOT NULL,
    `fechaInicio` DATETIME(3) NOT NULL,
    `fechaExpiracion` DATETIME(3) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CertificadoDigital_tiendaId_key`(`tiendaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogEnvioSunat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documentoId` INTEGER NOT NULL,
    `fechaEnvio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estadoEnvio` VARCHAR(191) NOT NULL,
    `mensaje` VARCHAR(191) NULL,
    `intento` INTEGER NOT NULL DEFAULT 1,
    `respuestaSunat` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SerieCorrelativo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tiendaId` INTEGER NOT NULL,
    `tipoDocumento` VARCHAR(191) NOT NULL,
    `serie` VARCHAR(191) NOT NULL,
    `ultimoNumero` INTEGER NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SerieCorrelativo_tiendaId_tipoDocumento_serie_key`(`tiendaId`, `tipoDocumento`, `serie`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CertificadoJoya` ADD CONSTRAINT `CertificadoJoya_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CertificadoJoya` ADD CONSTRAINT `CertificadoJoya_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CertificadoJoya` ADD CONSTRAINT `CertificadoJoya_gemaId_fkey` FOREIGN KEY (`gemaId`) REFERENCES `Gema`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CertificadoJoya` ADD CONSTRAINT `CertificadoJoya_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documento` ADD CONSTRAINT `Documento_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documento` ADD CONSTRAINT `Documento_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documento` ADD CONSTRAINT `Documento_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CertificadoDigital` ADD CONSTRAINT `CertificadoDigital_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogEnvioSunat` ADD CONSTRAINT `LogEnvioSunat_documentoId_fkey` FOREIGN KEY (`documentoId`) REFERENCES `Documento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SerieCorrelativo` ADD CONSTRAINT `SerieCorrelativo_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
