import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
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

  //Obtener todas las categorias
  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorias, endpoint publico, para que llenes tu combo box' })
  async getAllPublic() {
    return this.categoriaService.getAllPublic();
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
