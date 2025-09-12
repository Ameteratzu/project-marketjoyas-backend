/*
  Warnings:

  - You are about to drop the column `clienteId` on the `certificadojoya` table. All the data in the column will be lost.
  - You are about to drop the column `tiendaId` on the `certificadojoya` table. All the data in the column will be lost.
  - Added the required column `clienteDnioRUC` to the `CertificadoJoya` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteNombre` to the `CertificadoJoya` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tiendaDireccion` to the `CertificadoJoya` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tiendaNombre` to the `CertificadoJoya` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `certificadojoya` DROP FOREIGN KEY `CertificadoJoya_clienteId_fkey`;

-- DropForeignKey
ALTER TABLE `certificadojoya` DROP FOREIGN KEY `CertificadoJoya_tiendaId_fkey`;

-- DropIndex
DROP INDEX `CertificadoJoya_clienteId_fkey` ON `certificadojoya`;

-- DropIndex
DROP INDEX `CertificadoJoya_tiendaId_fkey` ON `certificadojoya`;

-- AlterTable
ALTER TABLE `certificadojoya` DROP COLUMN `clienteId`,
    DROP COLUMN `tiendaId`,
    ADD COLUMN `clienteDnioRUC` VARCHAR(191) NOT NULL,
    ADD COLUMN `clienteNombre` VARCHAR(191) NOT NULL,
    ADD COLUMN `descripcion` VARCHAR(191) NULL,
    ADD COLUMN `pais` VARCHAR(191) NULL,
    ADD COLUMN `tiendaDireccion` VARCHAR(191) NOT NULL,
    ADD COLUMN `tiendaNombre` VARCHAR(191) NOT NULL;
