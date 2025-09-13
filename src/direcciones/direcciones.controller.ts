import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { DireccionesService } from './direccione.services';
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from "../auth/roles.decorator";
import { CrearDireccion } from './dtos/crear-direccion.dto';
import { GetUser } from "../common/decorators/get-user.decorator";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('direcciones')
export class DireccionesController{
    constructor(private readonly direccionesService: DireccionesService) {}

    //Añadir una nueva direccion al usuario
    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('CLIENTE')
    @ApiOperation({ summary: 'Añadir una nueva dirección adicional' })
    async create(@Body() dto: CrearDireccion, @GetUser() user: JwtPayload){
        return this.direccionesService.create(dto, user);
    }
}