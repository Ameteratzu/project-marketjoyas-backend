import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ComparacionService } from './comparacion.service';
import { CreateComparacionDto } from './dtos/crear-comparacion.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Comparación de productos')
@ApiBearerAuth()
@Controller('comparacion')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENTE', 'VENDEDOR', 'ADMIN') 
export class ComparacionController {
  constructor(private readonly comparacionService: ComparacionService) {}

  // Añadir a comparacion
  @Post()
  async addComparacion(
    @GetUser() user: JwtPayload,
    @Body() dto: CreateComparacionDto,
  ) {
    return this.comparacionService.create(user.sub, dto.productoId);
  }

  // Obtener lista de comparacion
  @Get()
  async getComparacion(@GetUser() user: JwtPayload) {
    return this.comparacionService.findByUsuario(user.sub);
  }

  // Eliminar producto de comparacion
  @Delete(':productoId')
  async removeComparacion(
    @GetUser() user: JwtPayload,
    @Param('productoId', ParseIntPipe) productoId: number,
  ) {
    return this.comparacionService.deleteByProducto(user.sub, productoId);
  }
}
