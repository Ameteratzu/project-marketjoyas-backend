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
  ParseIntPipe,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { EstadoPedido } from '@prisma/client';
import { ActualizarPedidoDto } from './actualizar-pedido.dto';
import { ActualizarEstadoPDto } from './actualizar-estado.dto';

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('pedidos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  // Confirmar todos los productos del carrito agrupados por tienda
  @Post('confirmar')
  @Roles('CLIENTE')
  @ApiOperation({
    summary: 'Confirmar compra con todos los productos del carrito',
  })
  @HttpCode(201)
  async confirmarCompra(@GetUser() user: JwtPayload) {
    return this.pedidoService.confirmarPedido(user.sub);
  }

  // Obtener pedidos del cliente autenticado
  @Get()
  @Roles('CLIENTE')
  @ApiOperation({ summary: 'Obtener los pedidos del usuario autenticado' })
  async obtenerPedidos(@GetUser() user: JwtPayload) {
    return this.pedidoService.obtenerPedidos(user.sub);
  }

  // IMPORTANTE: esta ruta debe ir antes que la de `:id`
  @Get('tienda')
  @Roles('VENDEDOR', 'TRABAJADOR')
  @ApiOperation({
    summary:
      'Obtener todos los pedidos de la tienda (solo vendedor/trabajador)',
  })
  async obtenerPedidosTienda(@GetUser() user: JwtPayload) {
    if (!user.tiendaId) {
      throw new BadRequestException('No estás asociado a ninguna tienda.');
    }
    return this.pedidoService.obtenerPedidosPorTienda(user.tiendaId);
  }

  // Confirmar productos del carrito de una tienda específica
  @Post('confirmar/:tiendaId')
  @Roles('CLIENTE')
  @ApiOperation({ summary: 'Confirmar productos del carrito por tienda' })
  @HttpCode(201)
  async confirmarCompraPorTienda(
    @GetUser() user: JwtPayload,
    @Param('tiendaId', ParseIntPipe) tiendaId: number,
  ) {
    return this.pedidoService.confirmarPedidoPorTienda(user.sub, tiendaId);
  }

  // Obtener detalle de un pedido específico del cliente autenticado
  @Get(':id')
  @Roles('CLIENTE')
  @ApiOperation({
    summary: 'Obtener detalle de un pedido específico del usuario',
  })
  async obtenerDetallePedido(
    @Param('id', ParseIntPipe) pedidoId: number,
    @GetUser() user: JwtPayload,
  ) {
    return this.pedidoService.obtenerDetallePedidoCliente(pedidoId, user.sub);
  }

  // Cambiar el estado de un pedido (solo por vendedores o trabajadores)
  @Patch(':id/estado')
  @Roles('VENDEDOR', 'TRABAJADOR')
  @ApiOperation({
    summary:
      'Actualizar estado del pedido. Si se cambia a BORRADO, se elimina el pedido y sus productos.',
  })
  async actualizarEstado(
    @Param('id', ParseIntPipe) pedidoId: number,
    @Body() actualizarEstadoDto: ActualizarEstadoPDto,
    @GetUser() user: JwtPayload,
  ) {
    if (!user.tiendaId) {
      throw new BadRequestException(
        'El usuario no está asociado a ninguna tienda',
      );
    }

    return this.pedidoService.actualizarEstadoPedido(
      pedidoId,
      actualizarEstadoDto.estado,
      user.tiendaId,
    );
  }

  @Patch(':id')
  @Roles('VENDEDOR', 'TRABAJADOR')
  @ApiOperation({
    summary:
      'Actualizar datos completos del pedido (formaPago, moneda, productos, etc)',
  })
  async actualizarPedidoCompleto(
    @Param('id', ParseIntPipe) pedidoId: number,
    @Body() dto: ActualizarPedidoDto,
    @GetUser() user: JwtPayload,
  ) {
    if (!user.tiendaId) {
      throw new BadRequestException(
        'El usuario no está asociado a ninguna tienda',
      );
    }

    return this.pedidoService.actualizarPedidoCompleto(
      pedidoId,
      user.tiendaId,
      dto,
    );
  }
}
