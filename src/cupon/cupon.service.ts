import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';
import { CuponDto } from './dtos/crear-cupon.dto';
import { Cupon } from '@prisma/client';

@Injectable()
export class CuponService {
    constructor(private prisma: PrismaService) { }

    /**
     * Genera un código único para un cupón.
     * Se asegura de que no exista otro cupón con el mismo código.
     * @returns Promise<string> Código generado
     */
    private async generarCodigoUnico(): Promise<string> {
        let codigo = '';
        let existe = true;

        while (existe) {
            codigo = randomBytes(4).toString('hex').toUpperCase(); // 8 caracteres
            const cuponExistente = await this.prisma.cupon.findUnique({
                where: { codigo: codigo },
            });
            existe = !!cuponExistente;
        }

        return codigo;
    }

    /**
     * Crea un nuevo cupón con los datos recibidos.
     * @param dto Datos del cupón (descuento, tienda, producto, fecha de vencimiento)
     * @returns Promise<Cupon> Cupón creado
     */
    async crearCupon(dto: CuponDto): Promise<Cupon> {
        const codigo = await this.generarCodigoUnico();

        const cupon = await this.prisma.cupon.create({
            data: {
                codigo,
                descuento: dto.descuento,
                tiendaId: dto.tiendaId,
                productoId: dto.productoId,
                validoHasta: new Date(dto.validoHasta),
            },
        });

        return cupon;
    }

    /**
     * Obtiene todos los cupones registrados.
     * @returns Promise<Cupon[]> Lista de cupones
     */
    async obtenerTodos(): Promise<Cupon[]> {
        return this.prisma.cupon.findMany({
            orderBy: { id: 'desc' },
        });
    }

    /**
     * Obtiene un cupón por su ID.
     * @param id ID del cupón
     * @returns Promise<Cupon> Cupón encontrado
     * @throws NotFoundException si no existe
     */
    async obtenerPorId(id: number): Promise<Cupon> {
        const cupon = await this.prisma.cupon.findUnique({ where: { id } });
        if (!cupon) throw new NotFoundException('Cupón no encontrado');
        return cupon;
    }

    /**
     * Actualiza los datos de un cupón existente.
     * @param id ID del cupón
     * @param dto Nuevos datos del cupón
     * @returns Promise<Cupon> Cupón actualizado
     */
    async actualizarCupon(id: number, dto: CuponDto): Promise<Cupon> {
        await this.obtenerPorId(id); // validar existencia
        return this.prisma.cupon.update({
            where: { id },
            data: {
                descuento: dto.descuento,
                tiendaId: dto.tiendaId,
                productoId: dto.productoId,
                validoHasta: new Date(dto.validoHasta),
            },
        });
    }

    /**
     * Elimina un cupón por su ID.
     * @param id ID del cupón
     * @returns Promise<Cupon> Cupón eliminado
     */
    async eliminarCupon(id: number): Promise<Cupon> {
        await this.obtenerPorId(id); // validar existencia
        return this.prisma.cupon.delete({ where: { id } });
    }

    /**
     * Valida un cupón por su código.
     * Comprueba que exista, que no haya sido usado y que no esté vencido.
     * @param codigo Código del cupón
     * @returns Promise<Cupon> Cupón válido
     */
    async validarCupon(codigo: string): Promise<Cupon> {
        const cupon = await this.prisma.cupon.findUnique({ where: { codigo } });
        if (!cupon) throw new NotFoundException('Cupón no encontrado');
        if (cupon.usado) throw new BadRequestException('El cupón ya fue usado');
        if (cupon.validoHasta < new Date()) throw new BadRequestException('El cupón ha expirado');
        return cupon;
    }

    /**
     * Marca un cupón como usado.
     * @param codigo Código del cupón
     * @returns Promise<Cupon> Cupón actualizado como usado
     */
    async usarCupon(codigo: string): Promise<Cupon> {
        await this.validarCupon(codigo); // validar que esté activo
        return this.prisma.cupon.update({
            where: { codigo },
            data: { usado: true },
        });
    }
}
