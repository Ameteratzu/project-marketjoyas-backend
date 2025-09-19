import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CalificacionesService } from './calificaciones.service';
import { RegistrarCalificacion } from './dtos/RegistrarCalificacion.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { GetUser } from '../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ActualizarCalificacion } from './dtos/ActualizarCalificacion.dto';



@Controller('calificaciones')
export class CalificacionesController {
    constructor(private readonly service: CalificacionesService) { }

    /**
     * Crear una nueva calificación de un producto
     * @param dto - Datos de la calificación (productoId, estrellas, comentario)
     * @param user - Usuario autenticado (obtenido con el decorador @GetUser)
     * @returns La calificación creada
     */
    @Post()
    /**
 * Controlador para manejar rutas relacionadas con calificaciones.
 * Protegido por JWT y Roles, solo accesible para CLIENTES.
 */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('CLIENTE')
    @ApiOperation({
        summary: 'Un CLIENTE califica un producto',
    })
    create(@Body() dto: RegistrarCalificacion, @GetUser() user: JwtPayload) {
        return this.service.create(dto, user);
    }

    /**
     * Obtener todas las calificaciones realizadas por el cliente
     * @returns Lista de calificaciones con información del producto
     */
    @Get()
    /**
 * Controlador para manejar rutas relacionadas con calificaciones.
 * Protegido por JWT y Roles, solo accesible para CLIENTES.
 */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('CLIENTE')
    @ApiOperation({
        summary: 'Obtener todas las calificaciones de un CLIENTE',
        description: 'Permite a un CLIENTE visualizar todas sus calificaciones realizadas. Cada calificación incluye información del producto asociado. Puede paginarse usando parámetros page y limit en el servicio.',
    })
    findAll(
        @Query('page') page: number = 1,   // Número de página (opcional, por defecto 1)
        @Query('limit') limit: number = 10, // Cantidad de registros por página (opcional, por defecto 10)
        @GetUser() user: JwtPayload
    ) {
        return this.service.findAll(page, limit, user);
    }

    /**
     * Obtener una calificación por su ID
     * @param id - ID de la calificación
     * @returns La calificación encontrada
     */
    @Get(':id')
    /**
 * Controlador para manejar rutas relacionadas con calificaciones.
 * Protegido por JWT y Roles, solo accesible para CLIENTES.
 */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('CLIENTE')
    @ApiOperation({
        summary: 'Un CLIENTE visualizara una calificacion por id',
    })
    findOne(@Param('id') id: string, @GetUser() user: JwtPayload) {
        return this.service.findOne(+id, user); // +id convierte el string a number
    }

    /**
     * Actualizar una calificación existente del cliente
     * @param id - ID de la calificación a actualizar
     * @param dto - Datos a actualizar (parciales)
     * @param user - Usuario autenticado
     * @returns La calificación actualizada
     */
    @Patch(':id')
    /**
 * Controlador para manejar rutas relacionadas con calificaciones.
 * Protegido por JWT y Roles, solo accesible para CLIENTES.
 */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('CLIENTE')
    @ApiOperation({
        summary: 'Un CLIENTE podra actuzalizar sus calificaciones',
    })
    update(@Param('id') id: string, @Body() dto: ActualizarCalificacion, @GetUser() user: JwtPayload) {
        return this.service.update(+id, dto, user)
    }

    /**
     * Eliminar una calificación del cliente
     * @param id - ID de la calificación a eliminar
     * @param user - Usuario autenticado
     * @returns La calificación eliminada
     */
    @Delete(':id')
    /**
 * Controlador para manejar rutas relacionadas con calificaciones.
 * Protegido por JWT y Roles, solo accesible para CLIENTES.
 */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('CLIENTE')
    @ApiOperation({
        summary: 'Un CLIENTE podra elimar una calificacion por su id de la calificacion',
    })
    remove(@Param('id') id: string, @GetUser() user: JwtPayload) {
        return this.service.remove(+id, user);
    }
}
