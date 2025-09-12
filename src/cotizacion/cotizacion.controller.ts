import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { CotizacionService } from './cotizacion.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { GetUser } from '../common/decorators/get-user.decorator';
import { CrearCotizacionDto } from './dtos/crear-cotizacion.dto';
import { CambiarEstadoCotizacionDto } from './dtos/cambiar-estado-cotizacion.dto';

@ApiTags('Cotizaciones')
@Controller('cotizaciones')
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService) {}

  // ADMIN: Cambiar estado
  @Patch(':id/estado')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Un admin aprueba o deniega una cotización' })
  async cambiarEstadoCotizacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarEstadoCotizacionDto,
  ) {
    return this.cotizacionService.cambiarEstadoCotizacion(id, dto.estado);
  }

  // ADMIN: Ver todas las solicitudes
  @Get()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Un admin ve todas las solicitudes de cotización' })
  async getAllSolicitudesCotizacion() {
    return this.cotizacionService.getAllSolicitudesCotizacion();
  }

  // VENDEDOR/TRABAJADOR/ADMIN: Ver solicitudes aprobadas
  @Get('aprobadas')
  @Roles('VENDEDOR', 'TRABAJADOR', 'ADMIN')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Vendedores y trabajadores ven solicitudes aprobadas',
  })
  async getSolicitudesAprobadas() {
    return this.cotizacionService.getSolicitudesAprobadas();
  }

  // PUBLICO o CLIENTE: Crear una solicitud
  @Post()
  @ApiBearerAuth() // Para que Swagger muestre la opción del token
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({
    summary: 'Crear solicitud de cotización (público o usuario autenticado(toma datos del token si no llena por completo el formulario))',
  })
  async crearCotizacion(
    @Body() dto: CrearCotizacionDto,
    @GetUser() user?: JwtPayload,
  ) {
    return this.cotizacionService.crearSolicitudCotizacion(dto, user);
  }

  // CLIENTE: Ver mis solicitudes
  @Get('mias')
  @Roles('CLIENTE')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Cliente autenticado ve sus propias solicitudes',
  })
  async getMisSolicitudes(@GetUser() user: JwtPayload) {
    return this.cotizacionService.getSolicitudesPorUsuario(user);
  }

  //CLIENTE: Eliminar solicitud propia
  @Delete(':id')
  @Roles('CLIENTE')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Cliente autenticado elimina su propia solicitud',
  })
  async eliminarSolicitud(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtPayload,
  ) {
    return this.cotizacionService.eliminarSolicitud(id, user);
  }
}
