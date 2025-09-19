import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RegistrarCalificacion } from './dtos/RegistrarCalificacion.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ActualizarCalificacion } from './dtos/ActualizarCalificacion.dto';
import { ActualizarEstadoDto } from './dtos/ActualizarEstado.dto';

/**
 * Servicio para manejar operaciones relacionadas con las calificaciones de productos.
 * Permite crear, leer, actualizar y eliminar calificaciones, respetando permisos de usuario.
 */
@Injectable()
export class CalificacionesService {
    constructor(private prisma: PrismaService) { }

    /**
     * Crear una nueva calificación
     * @param dto - Datos de la calificación (productoId, estrellas, comentario)
     * @param user - Información del usuario que realiza la acción (JwtPayload)
     * @returns La calificación creada
     */
    async create(dto: RegistrarCalificacion, user: JwtPayload) {
        return this.prisma.calificacion.create({
            data: {
                productoId: dto.productoId,
                estrellas: dto.estrellas,
                comentario: dto.comentario,
                usuarioId: user.sub, // se asocia la calificación al usuario que la crea
            }
        });
    }

    /**
     * Obtener todas las calificaciones con paginación
     * @param page - Número de página (por defecto 1)
     * @param limit - Cantidad de registros por página (por defecto 10)
     * @returns Lista de calificaciones con información del producto
     */
    async findAll(page: number, limit: number, user: JwtPayload) {
        return this.prisma.calificacion.findMany({
            skip: (page - 1) * limit, // se saltan los registros de páginas anteriores
            take: limit,              // se toma solo la cantidad limitada de registros
            where: {
                usuarioId: user.sub,
            },
            include: {
                usuario: false,       // no se incluye información del usuario
                producto: true,       // se incluye información del producto asociado
            }
        })
    }

    /**
     * Obtener una calificación por su ID
     * @param id - ID de la calificación
     * @throws NotFoundException si no existe la calificación
     * @returns La calificación encontrada
     */
    async findOne(id: number, user: JwtPayload) {
        const califiaciones = await this.prisma.calificacion.findUnique({
            where: { id, usuarioId: user.sub },
            include: {
                usuario: false,
                producto: true,
            },
        });

        if (!califiaciones) {
            throw new NotFoundException('Calificaion no encontrada')
        }
        return califiaciones;
    }

    /**
     * Actualizar una calificación existente
     * @param id - ID de la calificación a actualizar
     * @param dto - Datos a actualizar (parciales)
     * @param user - Usuario que intenta realizar la actualización
     * @throws NotFoundException si la calificación no existe
     * @throws ForbiddenException si el usuario no es el dueño de la calificación
     * @returns La calificación actualizada
     */
    async update(id: number, dto: ActualizarCalificacion, user: JwtPayload) {
        const calificacion = await this.prisma.calificacion.findUnique({ where: { id } });
        if (!calificacion) throw new NotFoundException('Calificación no encontrada');
        if (calificacion.usuarioId !== user.sub) throw new ForbiddenException('No tienes permisos para actualizar esta calificación');

        return this.prisma.calificacion.update({
            where: { id },
            data: {
                productoId: dto.productoId,
                estrellas: dto.estrellas,
                comentario: dto.comentario,
                usuarioId: user.sub, // mantiene el usuario original como dueño
            },
        });
    }

    /**
     * Eliminar una calificación
     * @param id - ID de la calificación a eliminar
     * @param user - Usuario que intenta eliminar la calificación
     * @throws NotFoundException si la calificación no existe
     * @throws ForbiddenException si el usuario no es el dueño de la calificación
     * @returns La calificación eliminada
     */
    async remove(id: number, user: JwtPayload) {
        const calificacion = await this.prisma.calificacion.findUnique({ where: { id } });
        if (!calificacion) throw new NotFoundException('Calificación no encontrada');
        if (calificacion.usuarioId !== user.sub) throw new ForbiddenException('No tienes permisos para eliminar esta calificación');

        return this.prisma.calificacion.delete({
            where: { id },
        });
    }


    async updateEstado(id: number, dto: ActualizarEstadoDto, user: JwtPayload) {
        // validar que sea admin
        if (user.rol !== 'ADMIN') {
            throw new ForbiddenException('Solo el administrador puede cambiar estados');
        }

        // buscar la calificación
        const calificacion = await this.prisma.calificacion.findUnique({ where: { id } });
        if (!calificacion) {
            throw new NotFoundException('Calificación no encontrada');
        }

        // actualizar solo el estado
        return this.prisma.calificacion.update({
            where: { id },
            data: {
                estado: dto.estado,
            },
        });
    }
}
