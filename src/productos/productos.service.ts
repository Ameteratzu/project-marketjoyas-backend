import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CrearProductoDto } from './dtos/crear-producto.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Prisma } from '@prisma/client';
import { FiltrarProductosDto } from './dtos/filtrar-productos.dto';
import { UpdateProductoDto } from './dtos/actualizar-producto.dto';

///////////////////////////////EN ESTE SERVICIO ESTA LA LOGICA DE NEGOCIO DE PRODUCTOS////////////////////////////

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
          materialId: dto.materialId ?? null,
          gemaId: dto.gemaId ?? null,
          estiloId: dto.estiloId ?? null,
          ocasionId: dto.ocasionId ?? null,

          genero: dto.genero,
          condicion: dto.condicion,
          detalleCondicion: dto.detalleCondicion,
          paisOrigen: dto.paisOrigen,
          modelo: dto.modelo,
          poseeNiquel: dto.poseeNiquel,
          garantia: dto.garantia,
          peso: dto.peso ? new Prisma.Decimal(dto.peso) : null,
          talla: dto.talla,
          color: dto.color,

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

  //Funcion para actualizar productos

  async update(id: number, dto: UpdateProductoDto, user: JwtPayload) {
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
      throw new ForbiddenException(
        'No puedes actualizar productos de otra tienda',
      );
    }

    const nuevoStock = dto.enStock ?? producto.enStock;
    const diferenciaStock = nuevoStock - producto.enStock;

    // Manejo imágenes
    const imagenesExistentes = producto.imagenes;
    const imagenesAEliminarIds = dto.imagenesAEliminar ?? [];
    const imagenesNuevas = dto.imagenesNuevas ?? [];

    const cantidadDespues =
      imagenesExistentes.length -
      imagenesAEliminarIds.length +
      imagenesNuevas.length;

    if (cantidadDespues > 4) {
      throw new BadRequestException(
        'No puedes tener más de 4 imágenes por producto.',
      );
    }

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
      materialId: dto.materialId ?? producto.materialId,
      gemaId: dto.gemaId ?? producto.gemaId,
      estiloId: dto.estiloId ?? producto.estiloId,
      ocasionId: dto.ocasionId ?? producto.ocasionId,

      // NUEVOS CAMPOS
      genero: dto.genero ?? producto.genero,
      condicion: dto.condicion ?? producto.condicion,
      detalleCondicion: dto.detalleCondicion ?? producto.detalleCondicion,
      paisOrigen: dto.paisOrigen ?? producto.paisOrigen,
      modelo: dto.modelo ?? producto.modelo,
      poseeNiquel: dto.poseeNiquel ?? producto.poseeNiquel,
      garantia: dto.garantia ?? producto.garantia,
      peso:
        dto.peso !== undefined ? new Prisma.Decimal(dto.peso) : producto.peso,
      talla: dto.talla ?? producto.talla,
      color: dto.color ?? producto.color,
    };

    return await this.prisma.$transaction(async (prisma) => {
      // Eliminar imágenes que indicó el usuario
      if (imagenesAEliminarIds.length > 0) {
        await prisma.imagenProducto.deleteMany({
          where: { id: { in: imagenesAEliminarIds }, productoId: id },
        });
      }

      // Agregar imágenes nuevas
      if (imagenesNuevas.length > 0) {
        await prisma.imagenProducto.createMany({
          data: imagenesNuevas.map((url) => ({ url, productoId: id })),
        });
      }

      // Actualizar producto
      const productoActualizado = await prisma.producto.update({
        where: { id },
        data,
        include: { imagenes: true },
      });

      // Registrar movimiento de inventario si cambió stock
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
    if (!producto)
      throw new NotFoundException('Producto no encontrado o deshabilitado');

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
      throw new ForbiddenException(
        'No tienes permiso para habilitar este producto',
      );
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
      include: {
        imagenes: true,
        categoria: true,
        tienda: true,
        calificaciones: true,
        material: true,
        ocasion: true,
        gema: true,
        estilo: true,
      },
    });
  }

  // Obtener producto por id (para clientes o internautas no logueados)
  async findOne(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      include: {
        imagenes: true,
        categoria: true,
        tienda: true,
        calificaciones: true,
        material: true,
        ocasion: true,
        gema: true,
        estilo: true,
      },
    });

    if (!producto || !producto.habilitado) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  //Obtener productos por tienda (VENDEDOR SOLO PUEDE VER PRODUCTOS DE SU TIENDA) la actualice para que se pueda buscar por nombre

  async findByTienda(user: JwtPayload, nombre?: string) {
    if (!user.tiendaId) {
      throw new ForbiddenException('El usuario no pertenece a una tienda');
    }

    const where: any = { tiendaId: user.tiendaId };

    if (nombre) {
      where.nombre = {
        contains: nombre.trim(),
      };
    }

    return this.prisma.producto.findMany({
      where,
      include: { imagenes: true, categoria: true, calificaciones: true },
    });
  }

  /////////////////////////////////UN VENDEDOR O TRABADOR AUMENTA ESPECIFICAMENTE EL STOCK DE UN PRODUCTO DE SU TIENDA/////////////////

  async aumentarStock(productoId: number, cantidad: number, user: JwtPayload) {
    if (!user.tiendaId) {
      throw new ForbiddenException('El usuario no pertenece a una tienda');
    }

    const producto = await this.prisma.producto.findUnique({
      where: { id: productoId },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (producto.tiendaId !== user.tiendaId) {
      throw new ForbiddenException(
        'No tienes permiso para modificar este producto',
      );
    }

    const nuevoStock = producto.enStock + cantidad;

    return this.prisma.$transaction(async (prisma) => {
      const productoActualizado = await prisma.producto.update({
        where: { id: productoId },
        data: { enStock: nuevoStock },
      });

      await prisma.movimientoInventario.create({
        data: {
          tipo: 'ENTRADA',
          cantidad,
          productoId,
          usuarioId: user.sub,
        },
      });

      return productoActualizado;
    });
  }

  /////////////////////////////////UN VENDEDOR O TRABADOR REDUCE ESPECIFICAMENTE EL STOCK DE UN PRODUCTO DE SU TIENDA/////////////////

  async reducirStock(productoId: number, cantidad: number, user: JwtPayload) {
    if (!user.tiendaId) {
      throw new ForbiddenException('El usuario no pertenece a una tienda');
    }

    const producto = await this.prisma.producto.findUnique({
      where: { id: productoId },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (producto.tiendaId !== user.tiendaId) {
      throw new ForbiddenException(
        'No tienes permiso para modificar este producto',
      );
    }

    if (cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor que cero');
    }

    if (producto.enStock < cantidad) {
      throw new BadRequestException('No hay suficiente stock disponible');
    }

    const nuevoStock = producto.enStock - cantidad;

    return this.prisma.$transaction(async (prisma) => {
      const productoActualizado = await prisma.producto.update({
        where: { id: productoId },
        data: { enStock: nuevoStock },
      });

      await prisma.movimientoInventario.create({
        data: {
          tipo: 'SALIDA',
          cantidad,
          productoId,
          usuarioId: user.sub,
        },
      });

      return productoActualizado;
    });
  }

  //Funcion para buscar por nombre PRIVADO

  async buscarPorNombrePrivado(user: JwtPayload, nombre: string) {
    const nombreLimpio = nombre?.trim();
    if (!nombreLimpio || nombreLimpio.length < 2) {
      throw new BadRequestException('Introducir al menos 2 caracteres.');
    }
    return this.prisma.producto.findMany({
      where: {
        tiendaId: user.tiendaId,
        nombre: {
          contains: nombreLimpio,
          // mode: 'insensitive',
        },
      },
      include: {
        imagenes: true,
        categoria: true,
        tienda: true,
        calificaciones: true,
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
      include: {
        imagenes: true,
        categoria: true,
        tienda: true,
        calificaciones: true,
      },
    });
  }

  // Filtrar productos por categoria PUBLICO
  async findByCategoryPublic(categoriaId: number) {
    return this.prisma.producto.findMany({
      where: {
        categoriaId,
        habilitado: true,
      },
      include: {
        imagenes: true,
        categoria: true,
        tienda: true,
        calificaciones: true,
      },
    });
  }

  // Filtrar productos por categoria para VENDEDORES Y TRABAJADORES
  async findByCategoryPrivate(categoriaId: number, user: JwtPayload) {
    if (!user.tiendaId) {
      throw new ForbiddenException('El usuario no pertenece a una tienda');
    }

    return this.prisma.producto.findMany({
      where: {
        categoriaId,
        tiendaId: user.tiendaId,
      },
      include: { imagenes: true, categoria: true },
    });
  }

  //////////////////////////////////////FUNCION PARA FILTROS/////////////////////////////////////////////////////////////////////////////////////

  async filtrarProductos(query: FiltrarProductosDto) {
    const {
      materialIds,
      gemaIds,
      estiloIds,
      ocasionIds,
      precioMin,
      precioMax,
      orden,
    } = query;

    // Construir filtros dinámicos
    const filtros: any = {
      habilitado: true,
    };

    if (materialIds) filtros.material = { in: materialIds };
    if (gemaIds) filtros.gema = { in: gemaIds };
    if (estiloIds) filtros.estilo = { in: estiloIds };
    if (ocasionIds) filtros.ocasion = { in: ocasionIds };

    const min = precioMin ? Number(precioMin) : undefined;
    const max = precioMax ? Number(precioMax) : undefined;

    if (
      (min !== undefined && isNaN(min)) ||
      (max !== undefined && isNaN(max))
    ) {
      throw new BadRequestException(
        'precioMin y precioMax deben ser números válidos',
      );
    }

    if (min !== undefined && max !== undefined) {
      filtros.precio = { gte: min, lte: max };
    } else if (min !== undefined) {
      filtros.precio = { gte: min };
    } else if (max !== undefined) {
      filtros.precio = { lte: max };
    }

    // Ordenamiento
    let orderBy: any = { creadoEn: 'desc' };
    switch (orden) {
      case 'precio_asc':
        orderBy = { precio: 'asc' };
        break;
      case 'precio_desc':
        orderBy = { precio: 'desc' };
        break;
      case 'fecha_asc':
        orderBy = { creadoEn: 'asc' };
        break;
      case 'fecha_desc':
        orderBy = { creadoEn: 'desc' };
        break;
      case undefined:
        break;
      default:
        throw new BadRequestException('orden no válido');
    }

    return this.prisma.producto.findMany({
      where: filtros,
      orderBy,
      include: {
        imagenes: true,
        categoria: true,
        tienda: true,
        calificaciones: true,
      },
    });
  }
} //
