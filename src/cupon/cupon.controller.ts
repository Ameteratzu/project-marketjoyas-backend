import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { CuponService } from './cupon.service';
import { CuponDto } from './dtos/crear-cupon.dto';
import { Cupon } from '@prisma/client';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';


@Controller('cupon')
export class CuponController {
    constructor(private readonly cuponService: CuponService) { }

    /**
     * Crear un nuevo cupón
     * @param dto Datos del cupón (descuento, tienda, producto, fecha de vencimiento)
     * @returns Promise<Cupon> Cupón creado
     */
    @Post('/create')
    @ApiBearerAuth() // Swagger mostrará el token de autenticación
    @UseGuards(JwtAuthGuard, RolesGuard) // Protege las rutas con JWT y control de roles
    @Roles('VENDEDOR') // Solo usuarios con rol VENDEDOR pueden acceder
    @ApiOperation({ summary: 'Crear un nuevo cupón por VENDEDOR' })
    @ApiBody({ type: CuponDto })
    crear(@Body() dto: CuponDto): Promise<Cupon> {
        return this.cuponService.crearCupon(dto);
    }

    /**
     * Obtener todos los cupones
     * @returns Promise<Cupon[]> Lista de cupones
     */
    @Get()
    @ApiBearerAuth() // Swagger mostrará el token de autenticación
    @UseGuards(JwtAuthGuard, RolesGuard) // Protege las rutas con JWT y control de roles
    @Roles('VENDEDOR') // Solo usuarios con rol VENDEDOR pueden acceder
    @ApiOperation({ summary: 'Obtener todos los cupones por VENDEDOR' })
    obtenerTodos(): Promise<Cupon[]> {
        return this.cuponService.obtenerTodos();
    }

    /**
     * Obtener un cupón por su ID
     * @param id ID del cupón
     * @returns Promise<Cupon> Cupón encontrado
     */
    @Get(':id')
    @ApiBearerAuth() // Swagger mostrará el token de autenticación
    @UseGuards(JwtAuthGuard, RolesGuard) // Protege las rutas con JWT y control de roles
    @Roles('VENDEDOR') // Solo usuarios con rol VENDEDOR pueden acceder
    @ApiOperation({ summary: 'Obtener un cupón por ID por VENDEDOR' })
    @ApiParam({ name: 'id', type: Number })
    obtenerPorId(@Param('id') id: string): Promise<Cupon> {
        return this.cuponService.obtenerPorId(Number(id));
    }

    /**
     * Actualizar un cupón por ID
     * @param id ID del cupón
     * @param dto Nuevos datos del cupón
     * @returns Promise<Cupon> Cupón actualizado
     */
    @Patch('actualizar/:id')
    @ApiBearerAuth() // Swagger mostrará el token de autenticación
    @UseGuards(JwtAuthGuard, RolesGuard) // Protege las rutas con JWT y control de roles
    @Roles('VENDEDOR') // Solo usuarios con rol VENDEDOR pueden acceder
    @ApiOperation({ summary: 'Actualizar un cupón por ID por VENDEDOR' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: CuponDto })
    actualizar(@Param('id') id: string, @Body() dto: CuponDto): Promise<Cupon> {
        return this.cuponService.actualizarCupon(Number(id), dto);
    }



    /**
     * Validar un cupón por código
     * @param codigo Código del cupón
     * @returns Promise<Cupon> Cupón válido
     */
    @Post('validar/:codigo')
    @ApiBearerAuth() // Swagger mostrará el token de autenticación
    @UseGuards(JwtAuthGuard, RolesGuard) // Protege las rutas con JWT y control de roles
    @Roles('VENDEDOR') // Solo usuarios con rol VENDEDOR pueden acceder
    @ApiOperation({ summary: 'Validar un cupón por código por VENDEDOR' })
    @ApiParam({ name: 'codigo', type: String })
    validar(@Param('codigo') codigo: string): Promise<Cupon> {
        return this.cuponService.validarCupon(codigo);
    }

    /**
     * Marcar un cupón como usado
     * @param codigo Código del cupón
     * @returns Promise<Cupon> Cupón actualizado como usado
     */
    @Patch('usar/:codigo')
    @ApiBearerAuth() // Swagger mostrará el token de autenticación
    @UseGuards(JwtAuthGuard, RolesGuard) // Protege las rutas con JWT y control de roles
    @Roles('VENDEDOR') // Solo usuarios con rol VENDEDOR pueden acceder
    @ApiOperation({ summary: 'Marcar un cupón como usado por código por VENDEDOR' })
    @ApiParam({ name: 'codigo', type: String })
    usar(@Param('codigo') codigo: string): Promise<Cupon> {
        return this.cuponService.usarCupon(codigo);
    }

    /**
     * Eliminar un cupón por ID
     * @param id ID del cupón
     * @returns Promise<Cupon> Cupón eliminado
     */
    @Delete('eliminar/:id')
    @ApiBearerAuth() // Swagger mostrará el token de autenticación
    @UseGuards(JwtAuthGuard, RolesGuard) // Protege las rutas con JWT y control de roles
    @Roles('VENDEDOR') // Solo usuarios con rol VENDEDOR pueden acceder
    @ApiOperation({ summary: 'Eliminar un cupón por ID por VENDEDOR' })
    @ApiParam({ name: 'id', type: Number })
    eliminar(@Param('id') id: string): Promise<Cupon> {
        return this.cuponService.eliminarCupon(Number(id));
    }
}
