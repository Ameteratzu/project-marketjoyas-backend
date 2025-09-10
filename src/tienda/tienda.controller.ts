import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ActualizarTiendaDto } from './dtos/actualizar-tienda.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('tiendas')
export class TiendaController {
  constructor(
    private readonly tiendaService: TiendaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // Para ver todas las tienda
  @Get()
  @ApiOperation({
    summary: 'Un usuario publico puede ver todas las tiendas',
  })
  async getAllPublicas() {
    return this.tiendaService.findAllPublic();
  }

  // Para ver info de tienda especifica
  @Get(':id')
  @ApiOperation({
    summary: 'Un usuario publico puede ver toda la informacion de las tiendas',
  })
  async getUnaPublica(@Param('id') id: number) {
    return this.tiendaService.findOnePublic(id);
  }


  //actualizar datos de la tienda
  @Patch('mi-tienda')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'vendedor actualiza su tienda',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR')
  async actualizarTienda(
    @Body() dto: ActualizarTiendaDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.tiendaService.updateTienda(user.sub, dto); // solo espera la URL
  }
}
