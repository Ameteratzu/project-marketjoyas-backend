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
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_completo` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `dni` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NULL,
    `contraseña` VARCHAR(191) NOT NULL,
    `rol` ENUM('ADMIN', 'CLIENTE', 'VENDEDOR', 'TRABAJADOR') NOT NULL DEFAULT 'CLIENTE',
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tiendaId` INTEGER NULL,

    UNIQUE INDEX `Usuario_username_key`(`username`),
    UNIQUE INDEX `Usuario_email_key`(`email`),
    UNIQUE INDEX `Usuario_dni_key`(`dni`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecuperacionContraseña` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiracion` DATETIME(3) NOT NULL,
    `usado` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `RecuperacionContraseña_usuarioId_key`(`usuarioId`),
    UNIQUE INDEX `RecuperacionContraseña_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `logo` VARCHAR(191) NULL,
    `logoPublicId` VARCHAR(191) NULL,
    `ruc` VARCHAR(191) NULL,

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

-- CreateTable
CREATE TABLE `Categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Categoria_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Producto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `enStock` INTEGER NOT NULL DEFAULT 0,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `habilitado` BOOLEAN NOT NULL DEFAULT true,
    `imagen` VARCHAR(191) NULL,
    `tiendaId` INTEGER NOT NULL,
    `categoriaId` INTEGER NULL,
    `gemaId` INTEGER NULL,
    `materialId` INTEGER NULL,
    `estiloId` INTEGER NULL,
    `ocasionId` INTEGER NULL,
    `ofertaGlobalId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ocasion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Ocasion_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estilo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Estilo_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Gema` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Gema_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Material` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Material_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImagenProducto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `public_id` VARCHAR(191) NULL,
    `productoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovimientoInventario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('ENTRADA', 'SALIDA') NOT NULL DEFAULT 'ENTRADA',
    `cantidad` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `productoId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estado` ENUM('EMPAQUETADO', 'DESPACHO', 'ENVIO', 'ENTREGA') NOT NULL DEFAULT 'EMPAQUETADO',
    `codigoSeguimiento` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Pedido_codigoSeguimiento_key`(`codigoSeguimiento`),
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
    `proveedorPago` ENUM('MERCADOPAGO', 'IZIPAY', 'OTRO') NOT NULL,
    `transaccionId` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `metodoPago` VARCHAR(191) NULL,
    `monto` DECIMAL(10, 2) NOT NULL,
    `fechaPago` DATETIME(3) NOT NULL,
    `datosAdicionales` JSON NULL,

    UNIQUE INDEX `Pago_pedidoId_key`(`pedidoId`),
    UNIQUE INDEX `Pago_transaccionId_key`(`transaccionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Calificacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,
    `estrellas` INTEGER NOT NULL,
    `comentario` VARCHAR(191) NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(191) NOT NULL,
    `descuento` DOUBLE NOT NULL,
    `tiendaId` INTEGER NOT NULL,
    `productoId` INTEGER NULL,
    `validoHasta` DATETIME(3) NOT NULL,
    `usado` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Cupon_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SolicitudCotizacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NULL,
    `imagenUrl` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `estado` ENUM('PENDIENTE', 'APROBADA', 'DENEGADA') NOT NULL DEFAULT 'PENDIENTE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PropuestaCotizacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cotizacionId` INTEGER NOT NULL,
    `tiendaId` INTEGER NOT NULL,
    `precio` DOUBLE NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Favorito` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,

    UNIQUE INDEX `Favorito_usuarioId_productoId_key`(`usuarioId`, `productoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CarritoProducto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,

    UNIQUE INDEX `CarritoProducto_usuarioId_productoId_key`(`usuarioId`, `productoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comparacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,

    UNIQUE INDEX `Comparacion_usuarioId_productoId_key`(`usuarioId`, `productoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OfertaGlobal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `descuento` DOUBLE NOT NULL,
    `validoHasta` DATETIME(3) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CuentaOAuth` ADD CONSTRAINT `CuentaOAuth_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecuperacionContraseña` ADD CONSTRAINT `RecuperacionContraseña_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tienda` ADD CONSTRAINT `Tienda_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Suscripcion` ADD CONSTRAINT `Suscripcion_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_gemaId_fkey` FOREIGN KEY (`gemaId`) REFERENCES `Gema`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_estiloId_fkey` FOREIGN KEY (`estiloId`) REFERENCES `Estilo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_ocasionId_fkey` FOREIGN KEY (`ocasionId`) REFERENCES `Ocasion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_ofertaGlobalId_fkey` FOREIGN KEY (`ofertaGlobalId`) REFERENCES `OfertaGlobal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImagenProducto` ADD CONSTRAINT `ImagenProducto_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimientoInventario` ADD CONSTRAINT `MovimientoInventario_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimientoInventario` ADD CONSTRAINT `MovimientoInventario_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoDetalle` ADD CONSTRAINT `PedidoDetalle_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoDetalle` ADD CONSTRAINT `PedidoDetalle_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Calificacion` ADD CONSTRAINT `Calificacion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Calificacion` ADD CONSTRAINT `Calificacion_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cupon` ADD CONSTRAINT `Cupon_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cupon` ADD CONSTRAINT `Cupon_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SolicitudCotizacion` ADD CONSTRAINT `SolicitudCotizacion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropuestaCotizacion` ADD CONSTRAINT `PropuestaCotizacion_cotizacionId_fkey` FOREIGN KEY (`cotizacionId`) REFERENCES `SolicitudCotizacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropuestaCotizacion` ADD CONSTRAINT `PropuestaCotizacion_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorito` ADD CONSTRAINT `Favorito_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorito` ADD CONSTRAINT `Favorito_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CarritoProducto` ADD CONSTRAINT `CarritoProducto_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CarritoProducto` ADD CONSTRAINT `CarritoProducto_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comparacion` ADD CONSTRAINT `Comparacion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comparacion` ADD CONSTRAINT `Comparacion_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
