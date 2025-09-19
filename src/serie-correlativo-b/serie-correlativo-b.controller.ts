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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CrearSerieDto } from './dtos/crear-serie.dto';
import { EditarSerieDto } from './dtos/editar-serie.dto';
import { SerieCorrelativoBService } from './serie-correlativo-b.service';

@ApiTags('Series Correlativas BOLETA')
@Controller('seriesb')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SerieCorrelativoBController {
  constructor(private readonly serieService: SerieCorrelativoBService) {}

  @Post()
  @Roles('ADMIN', 'VENDEDOR', 'DEMOVENDEDOR', 'TRABAJADOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Crear nueva serie para una tienda' })
  async crearSerie(@Body() dto: CrearSerieDto, @GetUser() user: JwtPayload) {
    return this.serieService.crearSerie(dto, user);
  }

  @Get()
  @Roles('ADMIN', 'VENDEDOR', 'DEMOVENDEDOR', 'TRABAJADOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Obtener todas las series de la tienda del usuario',
  })
  async obtenerSeries(@GetUser() user: JwtPayload) {
    return this.serieService.obtenerSeries(user.tiendaId!);
  }

  @Get(':id')
  @Roles('ADMIN', 'VENDEDOR', 'DEMOVENDEDOR', 'TRABAJADOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Obtener una serie por ID' })
  async obtenerPorId(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtPayload,
  ) {
    return this.serieService.obtenerPorId(id, user.tiendaId!);
  }

  @Patch(':id')
  @Roles('ADMIN', 'VENDEDOR', 'DEMOVENDEDOR', 'TRABAJADOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Actualizar una serie por ID' })
  async actualizarSerie(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditarSerieDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.serieService.actualizarSerie(id, dto, user.tiendaId!);
  }

  @Delete(':id')
  @Roles('ADMIN', 'VENDEDOR', 'DEMOVENDEDOR', 'TRABAJADOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Eliminar una serie por ID' })
  async eliminarSerie(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtPayload,
  ) {
    return this.serieService.eliminarSerie(id, user.tiendaId!);
  }
}
