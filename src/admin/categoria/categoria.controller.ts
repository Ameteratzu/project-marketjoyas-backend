import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CrearCategoriaDto } from './dtos/crear-categoria.dto';
import { CategoriaService } from './categoria.service';
import { ActualizarCategoriaDto } from './dtos/actualizar-categoria.dto';



@ApiTags('Categoria')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('categoria')
export class CategoriaController {
      constructor(private readonly categoriaService: CategoriaService) {}


// Crear categoría
@Roles('ADMIN')

  @Post()
  async createCategory(@Body() dto: CrearCategoriaDto) {
    return this.categoriaService.createCategory(dto);
  }

  // Actualizar categoría
  @Roles('ADMIN')

  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: ActualizarCategoriaDto,
  ) {
    return this.categoriaService.updateCategory(+id, dto);
  }

  // Eliminar categoría
  @Roles('ADMIN')

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoriaService.deleteCategory(+id);
  }


}
