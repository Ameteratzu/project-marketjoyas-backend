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
import { MaterialService } from './material.service';
import { CrearGenericoDto } from '../dtos/crear-generico.dto';
import { ActualizarGenericoDto } from '../dtos/actualizar-generico.dto';
import { Roles } from '../../../auth/roles.decorator';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Materiales')
@ApiBearerAuth()
@Roles('ADMIN')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('materiales')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  // Crear material
  @Post()
  @ApiOperation({ summary: 'Un admin crea un material' })
  async create(@Body() dto: CrearGenericoDto) {
    return this.materialService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos los materiales con filtro opcional por nombre',
  })
  async findAll(@Query('nombre') nombre?: string) {
    return this.materialService.findAll(nombre);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un material por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un material por ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarGenericoDto,
  ) {
    return this.materialService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un material por ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.materialService.remove(id);
  }
}
