import { Controller, Post, Body, UseGuards, Req, Patch, Param, ParseIntPipe, Delete, Get } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CrearProductoDto } from './dtos/crear-producto.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Estilo, Gema, Material, Ocasion } from 'generated/prisma';


@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  //añadir producto
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'TRABAJADOR')
  async create(@Body() dto: CrearProductoDto, @GetUser() user: JwtPayload) {
    return this.productosService.create(dto, user);
  }

  //editar producto

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'TRABAJADOR')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CrearProductoDto>,
    @GetUser() user: JwtPayload,
  ) {
    return this.productosService.update(id, dto, user);
  }

  // eliminar producto, solo VENDEDORES/TRABAJADORES de su tienda
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'TRABAJADOR')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtPayload,
  ) {
    return this.productosService.remove(id, user);
  }

  // obtener todos los productos, acceso libre (para CLIENTES o internautas)
  @Get()
  async findAll() {
    return this.productosService.findAll();
  }

  // obtener producto por id, acceso libre (para CLIENTES o internautas)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  // obtener productos por tienda (VENDEDOR SOLO PUEDE VER PRODUCTOS DE SU TIENDA)
  @Get('mis-productos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'TRABAJADOR')
  async findByTienda(@GetUser() user: JwtPayload) {
    return this.productosService.findByTienda(user);
  }


  //Para que el frontend pueda llenar su combo box

  @Get('enums')
  getEnums() {
    return {
      materiales: Object.values(Material),
      gemas: Object.values(Gema),
      estilos: Object.values(Estilo),
      ocasiones: Object.values(Ocasion),
    };
  }
}

