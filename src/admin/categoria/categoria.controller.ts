import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { CrearCategoriaDto } from './dtos/crear-categoria.dto';
import { CategoriaService } from './categoria.service';
import { ActualizarCategoriaDto } from './dtos/actualizar-categoria.dto';

@ApiTags('Categoria')
@ApiBearerAuth()
@Roles('ADMIN')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  //Obtener todas las categorias
 @Get()
@ApiOperation({
  summary: 'Listar todas las categorías con filtro opcional por nombre',
})
@ApiQuery({
  name: 'nombre',
  required: false,
  description: 'Filtrar las categorías por nombre (opcional)',
  example: 'anillos',
})
async getAllPublic(@Query('nombre') nombre?: string) {
  return this.categoriaService.getAllPublic(nombre);
}

@Get(':id')
  @ApiOperation({ summary: 'Obtener una Categoria por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.findOne(id);
  }

  // Crear categoria
  @Roles('ADMIN')
  @Post()
  @ApiOperation({
    summary: 'Un admin crea una categoria',
  })
  async createCategory(@Body() dto: CrearCategoriaDto) {
    return this.categoriaService.createCategory(dto);
  }

  // Actualizar categoria
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Un admin actualiza una categoria',
  })
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: ActualizarCategoriaDto,
  ) {
    return this.categoriaService.updateCategory(+id, dto);
  }

  // Eliminar categoria
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Un admin elimina una categoria',
  })
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoriaService.deleteCategory(+id);
  }
}
