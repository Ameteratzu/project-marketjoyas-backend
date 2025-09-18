// estilo.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EstiloService } from './estilo.service';
import { CrearGenericoDto } from '../dtos/crear-generico.dto';
import { ActualizarGenericoDto } from '../dtos/actualizar-generico.dto';
import { Roles } from '../../../auth/roles.decorator';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Estilos')
@ApiBearerAuth()
@Roles('ADMIN', 'VENDEDOR')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('estilos')
export class EstiloController {
  constructor(private readonly estiloService: EstiloService) {}

  @Post()
  @ApiOperation({ summary: 'Un admin crea un estilo' })
  async create(@Body() dto: CrearGenericoDto) {
    return this.estiloService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos los estilos con filtro opcional por nombre, se puede consultar asi tambien para todas las caracteristicas /estilos?nombre=mo',
  })
  async findAll(@Query('nombre') nombre?: string) {
    return this.estiloService.findAll(nombre);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un estilo por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estiloService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un estilo por ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarGenericoDto,
  ) {
    return this.estiloService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un estilo por ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.estiloService.remove(id);
  }
}
