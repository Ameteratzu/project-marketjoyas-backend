import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoPedido } from '@prisma/client';

@Injectable()
export class PedidoService {
  constructor(private readonly prisma: PrismaService) {}

  async confirmarPedido(usuarioId: number) {
    const carrito = await this.prisma.carritoProducto.findMany({
      where: { usuarioId },
      include: {
        producto: {
          include: {
            tienda: true,
          },
        },
      },
    });

    if (carrito.length === 0) {
      throw new BadRequestException('El carrito está vacío.');
    }

    // Agrupar productos por tienda
    const productosPorTienda = new Map<number, typeof carrito>();

    for (const item of carrito) {
      const tiendaId = item.producto.tiendaId;

      let itemsDeTienda = productosPorTienda.get(tiendaId);
      if (!itemsDeTienda) {
        itemsDeTienda = [];
        productosPorTienda.set(tiendaId, itemsDeTienda);
      }

      itemsDeTienda.push(item);
    }

    const pedidosCreados: Array<Awaited<ReturnType<typeof this.prisma.pedido.create>>> = [];

    // Crear un pedido por tienda
    for (const [tiendaId, items] of productosPorTienda.entries()) {
      const pedido = await this.prisma.pedido.create({
        data: {
          usuarioId,
          tiendaId,
          productos: {
            create: items.map((item) => ({
              productoId: item.productoId,
              cantidad: item.cantidad,
            })),
          },
        },
        include: {
          productos: {
            include: {
              producto: {
                include: {
                  tienda: {
                    select: {
                      nombre: true,
                      telefono: true,
                      emailTienda: true,
                    },
                  },
                },
              },
            },
          },
          tienda: {
            select: {
              nombre: true,
              telefono: true,
              emailTienda: true,
            },
          },
        },
      });

      pedidosCreados.push(pedido);
    }

    // Vaciar el carrito
    await this.prisma.carritoProducto.deleteMany({
      where: { usuarioId },
    });

    return pedidosCreados;
  }

  async obtenerPedidos(usuarioId: number) {
    const pedidos = await this.prisma.pedido.findMany({
      where: { usuarioId },
      include: {
        productos: {
          include: {
            producto: {
              include: {
                tienda: {
                  select: {
                    nombre: true,
                    telefono: true,
                    emailTienda: true,
                  },
                },
              },
            },
          },
        },
        tienda: {
          select: {
            nombre: true,
            telefono: true,
            emailTienda: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    if (pedidos.length === 0) {
      throw new NotFoundException('No tienes pedidos aún.');
    }

    return pedidos;
  }



  //UN VENDEDOR PUEDE ACTUALIZAR EL ESTADO DE SUS PEDIDOS

  async actualizarEstadoPedido(pedidoId: number, nuevoEstado: EstadoPedido, tiendaId: number) {
  const pedido = await this.prisma.pedido.findUnique({
    where: { id: pedidoId },
    include: {
      productos: true,
    },
  });

  if (!pedido) {
    throw new NotFoundException('Pedido no encontrado');
  }

  // Asegurar que el pedido pertenezca a la tienda del usuario
  if (pedido.tiendaId !== tiendaId) {
    throw new BadRequestException('No tienes permiso para modificar este pedido');
  }

  if (nuevoEstado === 'BORRADO') {
    // Borrar pedido y sus detalles
    await this.prisma.pedidoDetalle.deleteMany({
      where: { pedidoId },
    });
    await this.prisma.pedido.delete({
      where: { id: pedidoId },
    });
    return { mensaje: 'Pedido cancelado y eliminado exitosamente' };
  }

  // Actualizar el estado
  const pedidoActualizado = await this.prisma.pedido.update({
    where: { id: pedidoId },
    data: {
      estado: nuevoEstado,
    },
  });

  return pedidoActualizado;
}

//UN CLIENTE PUEDE VER EL DETALLE DE SUS PRODUCTOS

async obtenerDetallePedidoCliente(pedidoId: number, usuarioId: number) {
  const pedido = await this.prisma.pedido.findFirst({
    where: {
      id: pedidoId,
      usuarioId,
    },
    include: {
      productos: {
        include: {
          producto: {
            include: {
              tienda: {
                select: {
                  nombre: true,
                  telefono: true,
                  emailTienda: true,
                },
              },
            },
          },
        },
      },
      tienda: {
        select: {
          nombre: true,
          telefono: true,
          emailTienda: true,
        },
      },
    },
  });

  if (!pedido) {
    throw new NotFoundException('Pedido no encontrado o no te pertenece');
  }

  return pedido;
}

//UN VENDEDOR PUEDE VER  LOS PEDIDOS DE SU TIENDA 

async obtenerPedidosPorTienda(tiendaId: number) {
  const pedidos = await this.prisma.pedido.findMany({
    where: {
      tiendaId,
    },
    include: {
      usuario: {
        select: {
          id: true,
          email: true,
        },
      },
      productos: {
        include: {
          producto: true,
        },
      },
    },
    orderBy: {
      fecha: 'desc',
    },
  });

  if (pedidos.length === 0) {
    throw new NotFoundException('No hay pedidos para esta tienda.');
  }

  return pedidos;
}



}
