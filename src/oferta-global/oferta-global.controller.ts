import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { OfertaGlobalService } from './oferta-global.service';
import { OfertaGlobalDto } from './dtos/ofertaGlobal.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

//@ApiBearerAuth()
//@UseGuards(JwtAuthGuard, RolesGuard)
//@Roles('ADMIN')
@Controller('oferta-global')
export class OfertaGlobalController {
  constructor(private readonly ofertaGlobalService: OfertaGlobalService) { }

  // Crear una oferta global
  @Post('/create')
  @ApiOperation({ summary: 'Crear una nueva oferta global por ADMIN', description: 'Permite a un ADMIN crear una oferta global y asociarla a productos.' })

  async create(@Body() dto: OfertaGlobalDto) {
    return this.ofertaGlobalService.create(dto);
  }

  // Obtener todas las ofertas
  @Get('/listar')
  @ApiOperation({ summary: 'Listar todas las ofertas globales por ADMIN', description: 'Obtiene todas las ofertas globales junto con los productos asociados.' })

  async findAll() {
    return this.ofertaGlobalService.findAll();
  }

  // Obtener una oferta por ID
  @Get('/listar/:id')
  @ApiOperation({ summary: 'Obtener una oferta global por ID por ADMIN', description: 'Permite obtener los detalles de una oferta global específica por su ID.' })

  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ofertaGlobalService.findOne(id);
  }

  // Actualizar una oferta global
  @Patch('/update/:id')
  @ApiOperation({ summary: 'Actualizar una oferta global por ADMIN', description: 'Permite actualizar los datos de una oferta global, incluyendo los productos asociados.' })

  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: OfertaGlobalDto) {
    return this.ofertaGlobalService.update(id, dto);
  }

  // Desactivar una oferta global
  @Patch('/desactivar/:id')
  @ApiOperation({ summary: 'Desactivar una oferta global por ADMIN', description: 'Marca la oferta global como inactiva sin eliminarla físicamente.' })

  async desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.ofertaGlobalService.desactivar(id);
  }

  // Activar una oferta global
  @Patch('/activar/:id')
  @ApiOperation({ summary: 'Activar una oferta global por ADMIN', description: 'Marca la oferta global como activa.' })

  async activar(@Param('id', ParseIntPipe) id: number) {
    return this.ofertaGlobalService.activar(id);
  }

  // Eliminar una oferta global
  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Eliminar una oferta global por ADMIN', description: 'Elimina físicamente la oferta global de la base de datos.' })
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.ofertaGlobalService.eliminar(id);
  }
}
