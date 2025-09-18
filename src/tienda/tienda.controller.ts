import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ActualizarTiendaDto } from './dtos/actualizar-tienda.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('tiendas')
export class TiendaController {
  constructor(private readonly tiendaService: TiendaService) {}

  // Para ver todas las tiendas, con filtro opcional por nombre
  @Get()
  @ApiOperation({
    summary:
      'Listar todos los estilos con filtro opcional por nombre, se puede consultar asi tambien para todas las caracteristicas /tiendas?nombre=mo',
  })
  async getAllPublicas(@Query('nombre') nombre?: string) {
    return this.tiendaService.findAllPublic(nombre);
  }

  // Para ver info de tienda específica
  @Get(':id')
  @ApiOperation({
    summary: 'Un usuario público puede ver toda la información de una tienda',
  })
  async getUnaPublica(@Param('id', ParseIntPipe) id: number) {
    return this.tiendaService.findOnePublic(id);
  }

  // Actualizar datos de la tienda
  @Patch('mi-tienda')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Vendedor actualiza su tienda',
  })
  @Roles('VENDEDOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async actualizarTienda(
    @Body() dto: ActualizarTiendaDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.tiendaService.updateTienda(user.sub, dto);
  }
}
