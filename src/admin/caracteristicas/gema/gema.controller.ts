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
import { GemaService } from './gema.service';
import { CrearGenericoDto } from '../dtos/crear-generico.dto';
import { ActualizarGenericoDto } from '../dtos/actualizar-generico.dto';
import { Roles } from '../../../auth/roles.decorator';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Gemas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'VENDEDOR')
@Controller('gemas')
export class GemaController {
  constructor(private readonly gemaService: GemaService) {}

  @Post()
  @ApiOperation({ summary: 'Un admin crea una gema' })
  async create(@Body() dto: CrearGenericoDto) {
    return this.gemaService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos las gemas con filtro opcional por nombre',
  })
  async findAll(@Query('nombre') nombre?: string) {
    return this.gemaService.findAll(nombre);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una gema por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gemaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una gema por ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarGenericoDto,
  ) {
    return this.gemaService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una gema por ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.gemaService.remove(id);
  }
}
