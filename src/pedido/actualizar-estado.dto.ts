import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  EMPAQUETADO = 'EMPAQUETADO',
  DESPACHO = 'DESPACHO',
  ENVIO = 'ENVIO',
  ENTREGA = 'ENTREGA',
  BORRADO = 'BORRADO',
}

export class ActualizarEstadoDto {
  @ApiProperty({
    description: 'Nuevo estado del pedido',
    enum: EstadoPedido,
    example: EstadoPedido.EMPAQUETADO,
  })
  @IsEnum(EstadoPedido)
  estado: EstadoPedido;
}
