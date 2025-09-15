import {
  Controller,
  Post,
  UseGuards,
  Get,
  HttpCode,
  Patch,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { EstadoPedido } from '@prisma/client';

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('pedidos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post('confirmar')
  @Roles('CLIENTE')
  @ApiOperation({ summary: 'Confirmar compra con los productos del carrito' })
  @HttpCode(201)
  async confirmarCompra(@GetUser() user: JwtPayload) {
    return this.pedidoService.confirmarPedido(user.sub);
  }

  @Get()
  @Roles('CLIENTE')
  @ApiOperation({ summary: 'Obtener los pedidos del usuario' })
  async obtenerPedidos(@GetUser() user: JwtPayload) {
    return this.pedidoService.obtenerPedidos(user.sub);
  }

  // IMPORTANTE: mover esta ruta antes de la de detalle con :id
  @Get('tienda')
  @Roles('VENDEDOR', 'TRABAJADOR')
  @ApiOperation({ summary: 'Obtener todos los pedidos de la tienda (solo vendedor/trabajador)' })
  async obtenerPedidosTienda(@GetUser() user: JwtPayload) {
    if (!user.tiendaId) {
      throw new BadRequestException('No estás asociado a ninguna tienda.');
    }
    return this.pedidoService.obtenerPedidosPorTienda(user.tiendaId);
  }

  @Get(':id')
  @Roles('CLIENTE')
  @ApiOperation({ summary: 'Obtener detalle de un pedido específico del usuario' })
  async obtenerDetallePedido(
    @Param('id') pedidoId: string,
    @GetUser() user: JwtPayload,
  ) {
    return this.pedidoService.obtenerDetallePedidoCliente(Number(pedidoId), user.sub);
  }

  @Patch(':id/estado')
  @Roles('VENDEDOR', 'TRABAJADOR')
  @ApiOperation({
    summary:
      'Actualizar estado del pedido (VENDEDOR o TRABAJADOR). Si lo cambia a CANCELADO se borra el pedido',
  })
  async actualizarEstado(
    @Param('id') pedidoId: string,
    @Body('estado') nuevoEstado: EstadoPedido,
    @GetUser() user: JwtPayload,
  ) {
    if (!user.tiendaId) {
      throw new BadRequestException(
        'El usuario no está asociado a ninguna tienda',
      );
    }
    return this.pedidoService.actualizarEstadoPedido(
      Number(pedidoId),
      nuevoEstado,
      user.tiendaId,
    );
  }
}
