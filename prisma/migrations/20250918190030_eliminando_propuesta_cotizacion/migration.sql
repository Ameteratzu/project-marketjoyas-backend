/*
  Warnings:

  - You are about to drop the `propuestacotizacion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `propuestacotizacion` DROP FOREIGN KEY `PropuestaCotizacion_cotizacionId_fkey`;

-- DropTable
DROP TABLE `propuestacotizacion`;

-- AddForeignKey
ALTER TABLE `Suscripcion` ADD CONSTRAINT `Suscripcion_tiendaId_fkey` FOREIGN KEY (`tiendaId`) REFERENCES `Tienda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
