import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DireccionesService } from './direccione.services';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CrearDireccion } from './dtos/crear-direccion.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateDireccion } from './dtos/actualizar-direccion.dto';


@ApiTags('Direcciones')
@Controller('direcciones')
export class DireccionesController {
  constructor(private readonly direccionesService: DireccionesService) {}


  //Crear direccion 

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @ApiOperation({ summary: 'Añadir una nueva dirección adicional' })
  async create(@Body() dto: CrearDireccion, @GetUser() user: JwtPayload) {
    return this.direccionesService.create(dto, user);
  }

  //Obtener todas las direcciones del usuario autenticado

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @ApiOperation({
    summary: 'Obtener todas las direcciones del usuario autenticado',
  })
  async findAll(@GetUser() user: JwtPayload) {
    return this.direccionesService.findAll(user);
  }

  //Obtener direccion por id  (usuario autenticado)

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @ApiOperation({
    summary: 'Obtener una dirección por id (solo del usuario autenticado)',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtPayload,
  ) {
    return this.direccionesService.findOne(id, user);
  }

  //Actualizar direccion del cliente autenticado
//
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @ApiOperation({
    summary: 'Actualizar una dirección por id (solo del usuario autenticado)',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDireccion,
    @GetUser() user: JwtPayload,
  ) {
    return this.direccionesService.update(id, dto, user);
  }

  //Eliminar direccion del usuario autenticado
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENTE')
  @ApiOperation({
    summary: 'Eliminar una dirección por id (solo del usuario autenticado)',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtPayload,
  ) {
    return this.direccionesService.remove(id, user);
  }
}
