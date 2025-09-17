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
import { FavoritosService } from './favoritos.service';
import { CreateFavoritoDto } from './dtos/crear-favorito.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';


@ApiTags('Favoritos')
@ApiBearerAuth()
@Controller('favoritos')
@Roles('CLIENTE') 
@UseGuards(JwtAuthGuard, RolesGuard)
export class FavoritosController {
  constructor(private readonly favoritoService: FavoritosService) {}


  //añadir favorito
  @Post()
  async addFavorito(
    @GetUser() user: JwtPayload,
    @Body() dto: CreateFavoritoDto,
  ) {
    return this.favoritoService.create(user.sub, dto.productoId);
  }


  //mostrar favoritos
  @Get()
  async getMisFavoritos(@GetUser() user: JwtPayload) {
    return this.favoritoService.findByUsuario(user.sub);
  }

  //eliminar de favoritos

  @Delete(':productoId')
  async removeFavorito(
    @GetUser() user: JwtPayload,
    @Param('productoId', ParseIntPipe) productoId: number,
  ) {
    return this.favoritoService.deleteByProducto(user.sub, productoId);
  }
}
