import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CrearProductoDto } from './dtos/crear-producto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import {  Prisma } from 'generated/prisma';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  //Funcion para crear productos
  async create(dto: CrearProductoDto, user: JwtPayload) {
    if (!user.tiendaId) {
      throw new ForbiddenException('El usuario no petenece a una tienda');
    }

    return this.prisma.producto.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        precio: new Prisma.Decimal(dto.precio),
        enStock: dto.enStock ?? 0,
        imagen: dto.imagen,
        categoriaId: dto.categoriaId,
        tiendaId: user.tiendaId,
        material: dto.material,
        ocasion: dto.ocasion,
        estilo: dto.estilo,
        gema: dto.gema,
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

    if (!producto || producto.tiendaId !== user.tiendaId) {
      throw new ForbiddenException('No puedes actualizar este producto');
    }

    //uso ?? ya que si envio algun campo vacio conserve el valor anterior
    const data: any = {
      nombre: dto.nombre ?? producto.nombre,
      descripcion: dto.descripcion ?? producto.descripcion,
      precio:
        dto.precio !== undefined ? new Prisma.Decimal(dto.precio) : producto.precio,
      enStock: dto.enStock ?? producto.enStock,
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

    return this.prisma.producto.update({
      where: { id },
      data,
      include: { imagenes: true },
    });
  }


  // Eliminar producto
  async remove(id: number, user: JwtPayload) {
    if (!user.tiendaId) {
      throw new ForbiddenException('El usuario no pertenece a ninguna tienda');
    }

    const producto = await this.prisma.producto.findUnique({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    if (producto.tiendaId !== user.tiendaId) {
      throw new ForbiddenException(
        'No puedes eliminar productos de otra tienda',
      );
    }

    return this.prisma.producto.delete({ where: { id } });
  }

  // Listar todos los productos (para clientes o internautas no logueados)
  async findAll() {
    return this.prisma.producto.findMany({
      include: { imagenes: true, categoria: true, tienda: true },
    });
  }

  // Obtener producto por id (para clientes o internautas no logueados)
  async findOne(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      include: { imagenes: true, categoria: true, tienda: true },
    });

    if (!producto) throw new NotFoundException('Producto no encontrado');
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
}
