import { 
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  ParseIntPipe,
  Get,
  Patch,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CarritoService } from './carrito.service';
import { AgregarCarritoDto } from './dtos/agregar-carrito.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Carrito')
@ApiBearerAuth()
@Controller('carrito')
@Roles('CLIENTE')

@UseGuards(JwtAuthGuard, RolesGuard)
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post()
  @ApiOperation({ summary: 'Agregar un producto al carrito o aumentar su cantidad' })
  @HttpCode(201) // Por convención, crear recurso responde 201
  async agregarProducto(
    @GetUser() user: JwtPayload,
    @Body() dto: AgregarCarritoDto,
  ) {
    return this.carritoService.agregarProducto(user.sub, dto.productoId, dto.cantidad);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos del carrito del usuario' })
  async obtenerCarrito(@GetUser() user: JwtPayload) {
    return this.carritoService.obtenerCarrito(user.sub);
  }//

  // Cambiamos DELETE por PATCH para quitar una unidad (modificación parcial)
  @Patch(':productoId/quitar-uno')
  @ApiOperation({ summary: 'Disminuir en una unidad la cantidad de un producto en el carrito' })
  @HttpCode(200) // Modificación exitosa devuelve 200 OK
  async quitarUnaUnidad(
    @GetUser() user: JwtPayload,
    @Param('productoId', ParseIntPipe) productoId: number,
  ) {
    return this.carritoService.quitarUnaUnidad(user.sub, productoId);
  }

  @Delete(':productoId')
  @ApiOperation({ summary: 'Eliminar completamente un producto del carrito' })
  @HttpCode(204) // No content
  async eliminarProducto(
    @GetUser() user: JwtPayload,
    @Param('productoId', ParseIntPipe) productoId: number,
  ) {
    return this.carritoService.eliminarProducto(user.sub, productoId);
  }

  @Delete()
  @ApiOperation({ summary: 'Vaciar todo el carrito del usuario' })
  @HttpCode(204) // No content
  async vaciarCarrito(@GetUser() user: JwtPayload) {
    return this.carritoService.vaciarCarrito(user.sub);
  }
}
