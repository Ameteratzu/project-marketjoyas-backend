// ocasion.controller.ts
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
import { OcasionService } from './ocasion.service';
import { CrearGenericoDto } from '../dtos/crear-generico.dto';
import { ActualizarGenericoDto } from '../dtos/actualizar-generico.dto';
import { Roles } from '../../../auth/roles.decorator';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Ocasiones')
@ApiBearerAuth()
@Roles('ADMIN')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ocasiones')
export class OcasionController {
  constructor(private readonly ocasionService: OcasionService) {}

  @Post()
  @ApiOperation({ summary: 'Un admin crea una ocasión' })
  async create(@Body() dto: CrearGenericoDto) {
    return this.ocasionService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todo ocasion con filtro opcional por nombre',
  })
  async findAll(@Query('nombre') nombre?: string) {
    return this.ocasionService.findAll(nombre);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una ocasión por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ocasionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una ocasión por ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarGenericoDto,
  ) {
    return this.ocasionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una ocasión por ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.ocasionService.remove(id);
  }
}
