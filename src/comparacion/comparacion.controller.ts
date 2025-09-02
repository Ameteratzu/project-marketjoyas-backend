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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ComparacionService } from './comparacion.service';
import { CreateComparacionDto } from './dtos/crear-comparacion.dto';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@ApiTags('Comparación de productos')
@ApiBearerAuth()
@Controller('comparacion')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENTE')
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
