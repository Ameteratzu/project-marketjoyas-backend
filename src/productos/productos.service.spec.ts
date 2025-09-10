import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import {
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CrearProductoDto } from './dtos/crear-producto.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';


describe('ProductosService', () => {
  let service: ProductosService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductosService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue({
        producto: {
          create: jest.fn(),
          findUnique: jest.fn(),
          update: jest.fn(),
          findMany: jest.fn(),
        },
        movimientoInventario: {
          create: jest.fn(),
        },
        $transaction: jest.fn((cb) =>
          cb({
            producto: {
              create: jest.fn(),
              update: jest.fn(),
            },
            movimientoInventario: {
              create: jest.fn(),
            },
          }),
        ),
      })
      .compile();

    service = module.get<ProductosService>(ProductosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /////////////////PRUEBA PARA  CREAR PRODUCTO/////////////

  describe('create', () => {
    it('debería crear un producto con inventario si hay stock', async () => {
      const dto: CrearProductoDto = {
        nombre: 'Anillo',
        descripcion: 'Anillo de oro',
        precio: 100,
        enStock: 10,
        imagen: 'imagen.jpg',
        categoriaId: 1,
        imagenes: ['img1.jpg', 'img2.jpg'],
      };

      const user: JwtPayload = {
        sub: 1,
        email: 'user@example.com',
        rol: 'vendedor',
        tiendaId: 5,
      };

      const mockProductoCreado = { id: 1, ...dto };

      prisma.$transaction = jest.fn().mockImplementation(async (cb) =>
        cb({
          producto: {
            create: jest.fn().mockResolvedValue(mockProductoCreado),
          },
          movimientoInventario: {
            create: jest.fn().mockResolvedValue({}),
          },
        }),
      );

      const result = await service.create(dto, user);
      expect(result).toEqual(mockProductoCreado);
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  /////////////////PRUEBA PARA  ACTUALIZAR PRODUCTO/////////////
describe('update', () => {
  const user: JwtPayload = {
    sub: 1,
    email: 'user@example.com',
    rol: 'vendedor',
    tiendaId: 5,
  };

  const productoExistente = {
    id: 1,
    nombre: 'Producto',
    enStock: 10,
    tiendaId: 5,
    precio: new Prisma.Decimal(100),
    descripcion: '',
    imagen: '',
    categoriaId: 1,
    imagenes: [
      { id: 101, url: 'img1.jpg', productoId: 1, public_id: null },
      { id: 102, url: 'img2.jpg', productoId: 1, public_id: null },
      { id: 103, url: 'img3.jpg', productoId: 1, public_id: null },
      { id: 104, url: 'img4.jpg', productoId: 1, public_id: null },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería actualizar producto, eliminar y agregar imágenes, y registrar movimiento inventario', async () => {
    const dto = {
      enStock: 15,
      imagenesAEliminar: [101, 102], // quiere eliminar 2 imágenes
      imagenesNuevas: ['img5.jpg', 'img6.jpg'], // y agregar 2 nuevas
      nombre: 'Producto actualizado',
    };

    prisma.producto.findUnique = jest.fn().mockResolvedValue(productoExistente);

    // Mock del $transaction para simular el deleteMany, createMany, update y create movimientoInventario
    prisma.$transaction = jest.fn().mockImplementation(async (cb) =>
      cb({
        imagenProducto: {
          deleteMany: jest.fn().mockResolvedValue({ count: dto.imagenesAEliminar.length }),
          createMany: jest.fn().mockResolvedValue({ count: dto.imagenesNuevas.length }),
        },
        producto: {
          update: jest.fn().mockResolvedValue({
            ...productoExistente,
            ...dto,
            enStock: dto.enStock,
            nombre: dto.nombre,
            imagenes: [
              // imágenes restantes + nuevas (simulado)
              { id: 103, url: 'img3.jpg', productoId: 1 },
              { id: 104, url: 'img4.jpg', productoId: 1 },
              { id: 105, url: 'img5.jpg', productoId: 1 },
              { id: 106, url: 'img6.jpg', productoId: 1 },
            ],
          }),
        },
        movimientoInventario: {
          create: jest.fn().mockResolvedValue({}),
        },
      }),
    );

    const resultado = await service.update(productoExistente.id, dto, user);

    expect(prisma.producto.findUnique).toHaveBeenCalledWith({
      where: { id: productoExistente.id },
      include: { imagenes: true },
    });

    // Validar que se haya llamado deleteMany con los ids correctos
    expect(prisma.$transaction).toHaveBeenCalled();
    const transactionArg = (prisma.$transaction as jest.Mock).mock.calls[0][0];

    // Como $transaction recibe un callback, validamos que las funciones dentro hayan sido llamadas
    const context = {
      imagenProducto: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
      producto: {
        update: jest.fn(),
      },
      movimientoInventario: {
        create: jest.fn(),
      },
    };
    await transactionArg(context);

    expect(context.imagenProducto.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: dto.imagenesAEliminar }, productoId: productoExistente.id },
    });

    expect(context.imagenProducto.createMany).toHaveBeenCalledWith({
      data: dto.imagenesNuevas.map((url) => ({ url, productoId: productoExistente.id })),
    });

    expect(context.producto.update).toHaveBeenCalledWith({
      where: { id: productoExistente.id },
      data: expect.objectContaining({
        nombre: dto.nombre,
        enStock: dto.enStock,
      }),
      include: { imagenes: true },
    });

    expect(context.movimientoInventario.create).toHaveBeenCalledWith({
      data: {
        tipo: 'ENTRADA', // 15 - 10 = 5 stock disminuido
        cantidad: 5,
        productoId: productoExistente.id,
        usuarioId: user.sub,
      },
    });

    // Validar resultado final contiene las imágenes actualizadas
    expect(resultado.imagenes.length).toBe(4);
    expect(resultado.nombre).toBe(dto.nombre);
    expect(resultado.enStock).toBe(dto.enStock);
  });

  // Mantén las otras pruebas igual, sólo asegurándote que usen el dto correcto (UpdateProductoDto)
  it('debería lanzar ForbiddenException si el producto pertenece a otra tienda', async () => {
    prisma.producto.findUnique = jest.fn().mockResolvedValue({ tiendaId: 2 });

    await expect(
      service.update(
        1,
        {},
        {
          sub: 1,
          email: 'user@example.com',
          rol: 'vendedor',
          tiendaId: 1,
        },
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('debería lanzar NotFoundException si no encuentra el producto', async () => {
    prisma.producto.findUnique = jest.fn().mockResolvedValue(null);

    await expect(
      service.update(
        1,
        {},
        {
          sub: 1,
          email: 'user@example.com',
          rol: 'vendedor',
          tiendaId: 1,
        },
      ),
    ).rejects.toThrow(NotFoundException);
  });
});

});
