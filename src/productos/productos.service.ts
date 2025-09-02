import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CrearProductoDto } from './dtos/crear-producto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Prisma } from '@prisma/client';


///////////////////////////////EN ESTE SERVICIO ESTA LA LOGICA DE NEGOCIO DE PRODUCTOS/////////////////////////

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  //Funcion para crear productos
  async create(dto: CrearProductoDto, user: JwtPayload) {
    if (!user.tiendaId) {
      throw new ForbiddenException('El usuario no pertenece a una tienda');
    }
    const tiendaId = user.tiendaId;

    return await this.prisma.$transaction(async (prisma) => {
      const producto = await prisma.producto.create({
        data: {
          nombre: dto.nombre,
          descripcion: dto.descripcion,
          precio: new Prisma.Decimal(dto.precio),
          enStock: dto.enStock ?? 0,
          imagen: dto.imagen,
          categoriaId: dto.categoriaId,
          tiendaId: tiendaId,
          material: dto.material ?? undefined,
          ocasion: dto.ocasion ?? undefined,
          estilo: dto.estilo ?? undefined,
          gema: dto.gema ?? undefined,
          imagenes: dto.imagenes
            ? {
                create: dto.imagenes.map((url) => ({ url })),
              }
            : undefined,
        },
        include: {
          imagenes: true,
        },
      });

      const enStock = dto.enStock ?? 0;
      if (enStock > 0) {
        await prisma.movimientoInventario.create({
          data: {
            tipo: 'ENTRADA',
            cantidad: enStock,
            productoId: producto.id,
            usuarioId: user.sub,
          },
        });
      }

      return producto;
    });
  }

  //Funcion para actualizar productos, añadir stock

  async update(id: number, dto: Partial<CrearProductoDto>, user: JwtPayload) {
    if (!user.tiendaId) {
      throw new ForbiddenException('El usuario no pertenece a una tienda');
    }

    const producto = await this.prisma.producto.findUnique({
      where: { id },
      include: { imagenes: true },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    if (producto.tiendaId !== user.tiendaId) {
      throw new ForbiddenException('No puedes actualizar productos de otra tienda');
    }

    // Calcular la cantidad de stock a agregar
    const nuevoStock = dto.enStock ?? producto.enStock;

    const diferenciaStock = nuevoStock - producto.enStock;

    const data: any = {
      nombre: dto.nombre ?? producto.nombre,
      descripcion: dto.descripcion ?? producto.descripcion,
      precio:
        dto.precio !== undefined
          ? new Prisma.Decimal(dto.precio)
          : producto.precio,
      enStock: nuevoStock,
      imagen: dto.imagen ?? producto.imagen,
      categoriaId: dto.categoriaId ?? producto.categoriaId,
      material: dto.material ?? producto.material,
      gema: dto.gema ?? producto.gema,
      estilo: dto.estilo ?? producto.estilo,
      ocasion: dto.ocasion ?? producto.ocasion,
    };

    if (dto.imagenes && dto.imagenes.length > 0) {
      data.imagenes = {
        create: dto.imagenes.map((url) => ({ url })),
      };
    }

    return await this.prisma.$transaction(async (prisma) => {
      // Actualiza producto
      const productoActualizado = await prisma.producto.update({
        where: { id },
        data,
        include: { imagenes: true },
      });

      // Si cambió el stock, registra el movimiento
      if (diferenciaStock !== 0) {
        await prisma.movimientoInventario.create({
          data: {
            tipo: diferenciaStock > 0 ? 'ENTRADA' : 'SALIDA',
            cantidad: Math.abs(diferenciaStock),
            productoId: id,
            usuarioId: user.sub,
          },
        });
      }

      return productoActualizado;
    });
  }

  // Eliminar producto //corregido
  async remove(id: number, user: JwtPayload) {
  if (!user.tiendaId) {
    throw new ForbiddenException('El usuario no pertenece a ninguna tienda');
  }

  const producto = await this.prisma.producto.findUnique({ where: { id } });
  if (!producto) throw new NotFoundException('Producto no encontrado o deshabilitado');

  if (producto.tiendaId !== user.tiendaId) {
    throw new ForbiddenException(
      'No puedes eliminar productos de otra tienda',
    );
  }

  // Soft delete: marcar como deshabilitado
  return this.prisma.producto.update({
    where: { id },
    data: { habilitado: false },
  });
}


//Funcion para habilitar productos


async habilitarProducto(id: number, user: JwtPayload) {
  const producto = await this.prisma.producto.findUnique({
    where: { id },
  });

  if (!producto) {
    throw new NotFoundException('Producto no encontrado');
  }

  if (producto.tiendaId !== user.tiendaId) {
    throw new ForbiddenException('No tienes permiso para habilitar este producto');
  }

  if (producto.habilitado) {
    throw new BadRequestException('El producto ya está habilitado');
  }

  return this.prisma.producto.update({
    where: { id },
    data: { habilitado: true },
  });
}


  // Listar todos los productos (para clientes o internautas no logueados)
  async findAll() {
    return this.prisma.producto.findMany({
      where: { habilitado: true },
      include: { imagenes: true, categoria: true, tienda: true },
    });
  }

  // Obtener producto por id (para clientes o internautas no logueados)
  async findOne(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      include: { imagenes: true, categoria: true, tienda: true },
    });

    if (!producto || !producto.habilitado) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  //Obtener productos por tienda (VENDEDOR SOLO PUEDE VER PRODUCTOS DE SU TIENDA)

  async findByTienda(user: JwtPayload) {
    if (!user.tiendaId) {
      throw new ForbiddenException('El usuario no pertenece a una tienda');
    }

    return this.prisma.producto.findMany({
      where: { tiendaId: user.tiendaId },
      include: { imagenes: true, categoria: true },
    });
  }

    //Funcion para buscar por nombre PRIVADO


  async buscarPorNombrePrivado(user: JwtPayload, nombre: string){
    const nombreLimpio = nombre?.trim();
    if (!nombreLimpio || nombreLimpio.length < 2 ){
      throw new BadRequestException('Introducir al menos 2 caracteres.')
    }
    return this.prisma.producto.findMany({
      where: {
        tiendaId: user.tiendaId,
        nombre :{
          contains: nombreLimpio,
          // mode: 'insensitive', 

        },

      },
    });
  }

  //Funcion para buscar por nombre

 async buscarPorNombrePublico(nombre: string) {
  const nombreLimpio = nombre.trim();

  return this.prisma.producto.findMany({
    where: {
      nombre: {
        contains: nombreLimpio,
        // mode: 'insensitive',
      },
      habilitado: true,
    },
  });
}

}
