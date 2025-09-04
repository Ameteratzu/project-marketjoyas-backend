import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { CotizacionService } from './cotizacion.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CrearCotizacionDto } from './dtos/crear-cotizacion.dto';

@ApiTags('Cotizacion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cotizacion')
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService) {}

  //Para ver TODAS las cotizaciones

  @Roles('ADMIN')
  @Get('cotizaciones')
  @ApiOperation({
    summary: 'Un admin ve todas las solicitudes de cotizacion',
  })
  async getAllSolicitudesCotizacion() {
    return this.cotizacionService.getAllSolicitudesCotizacion();
  }

  //Ver solicitudes aprobadas
  @Get('aprobadas')
  @Roles('VENDEDOR', 'TRABAJADOR')
  @ApiOperation({
    summary: 'Vendedores y trabajadores ven solicitudes aprobadas',
  })
  async getSolicitudesAprobadas() {
    return this.cotizacionService.getSolicitudesAprobadas();
  }

  // Crear una solicitud
  @Post()
  @Roles('CLIENTE')
  @ApiOperation({ summary: 'Crear solicitud de cotizacion' })
  async crearCotizacion(
    @Body() dto: CrearCotizacionDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.cotizacionService.crearSolicitudCotizacion(dto, user);
  }

  // Ver solicitudes

  @Get('mias')
  @Roles('CLIENTE')
  @ApiOperation({
    summary: 'para que los clientes vean sus solicitudes de cotizacion',
  })
  async getMisSolicitudes(@GetUser() user: JwtPayload) {
    return this.cotizacionService.getSolicitudesPorUsuario(user);
  }

  // Eliminar solicitud
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar solicitudes solo si le pertenece' })
  async eliminarSolicitud(
    @Param('id') id: number,
    @GetUser() user: JwtPayload,
  ) {
    return this.cotizacionService.eliminarSolicitud(id, user);
  }
}
