import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  Get,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CrearProductoDto } from './dtos/crear-producto.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UpdateProductoDto } from './dtos/actualizar-producto.dto';
import { BuscarProductoDto } from './dtos/buscar-producto.dto';
import { CategoriaIdDto } from './dtos/categoria-id.dto';
import { FiltrarProductosDto } from './dtos/filtrar-productos.dto';

@Controller('productos')
export class ProductosController {
  constructor(
    private readonly productosService: ProductosService,
  ) {}

  //añadir producto
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'TRABAJADOR')
  @ApiOperation({
    summary: 'Un VENDEDOR o TRABAJADOR añaden un producto',
  })
  async create(@Body() dto: CrearProductoDto, @GetUser() user: JwtPayload) {
    return this.productosService.create(dto, user);
  }

  //editar producto

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'TRABAJADOR')
  @ApiBody({ type: CrearProductoDto })
  @ApiOperation({
    summary: 'Un VENDEDOR o TRABAJADOR actualizan un producto',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductoDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.productosService.update(id, dto, user);
  }

  // obtener productos por tienda (VENDEDOR SOLO PUEDE VER PRODUCTOS DE SU TIENDA)
  @Get('mis-productos')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'TRABAJADOR')
  @ApiOperation({
    summary: 'Un VENDEDOR o TRABAJADOR obtienen sus productos segun su tienda',
  })
  async findByTienda(@GetUser() user: JwtPayload) {
    return this.productosService.findByTienda(user);
  }

  // eliminar producto (SoftDelete), solo VENDEDORES/TRABAJADORES de su tienda
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'TRABAJADOR')
  @ApiOperation({
    summary: 'Deshabilita (soft delete) un producto de la tienda',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtPayload,
  ) {
    return this.productosService.remove(id, user);
  }

  // Habilitar producto

  @Patch(':id/habilitar')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'TRABAJADOR')
  @ApiOperation({
    summary: 'Un VENDEDOR o TRABAJADOR habilitan un producto de su tienda',
  })
  async habilitar(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtPayload,
  ) {
    return this.productosService.habilitarProducto(id, user);
  }

  // obtener todos los productos, acceso libre (para CLIENTES o internautas)
  @Get()
  @ApiOperation({
    summary: 'Obtener todos lo productos, endpoint con acceso libre al publico',
  })
  async findAll() {
    return this.productosService.findAll();
  }

  // obtener productos por nombre (para CLIENTES o internautas)

  @Get('buscar')
  @ApiOperation({
    summary:
      'Obtener todos lo productos por nombre, endpoint con acceso libre al publicoo',
  })
  async buscarPorNombre(@Query() query: BuscarProductoDto) {
    return this.productosService.buscarPorNombrePublico(query.nombre);
  }

  //obtener productos por nombre (para VENDEDORES/TRABAJADORES)
  @Get('buscar/mis-productos')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'TRABAJADOR')
  @ApiOperation({
    summary:
      'Obtener todos lo productos por nombre, endpoint para VENDEDORES O TRABAJADORES, obtiene solo productos de su tienda',
  })
  async buscarPorNombrePrivado(
    @GetUser() user: JwtPayload,
    @Query('nombre') nombre: string,
  ) {
    return this.productosService.buscarPorNombrePrivado(user, nombre);
  }

  // obtener producto por id, acceso libre (para CLIENTES o internautas)
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener todos lo productos por ID, endpoint para todo publico',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  // Filtrar productos por categoria publico
  @Get('categoria/:categoriaId')
  @ApiOperation({
    summary: 'Obtener productos por categoraiaId publico',
  })
  async findByCategoryPublic(@Param() params: CategoriaIdDto) {
    return this.productosService.findByCategoryPublic(params.categoriaId);
  }

  // Filtrar productos por categoria para traajadores o vendedores
  @Get('categoria/mis-productos/:categoriaId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'TRABAJADOR')
  @ApiOperation({
    summary:
      'Obtener productos por por categoriaId para trabajadores o vendedores',
  })
  async findByCategoryPrivate(
    @GetUser() user: JwtPayload,
    @Param() params: CategoriaIdDto,
  ) {
    return this.productosService.findByCategoryPrivate(
      params.categoriaId,
      user,
    );
  }

  @Get('filtrar')
   @ApiOperation({
    summary:
      'Filtros manejados desde el backend',
  })
  filtrarProductos(@Query() query: FiltrarProductosDto) {
  return this.productosService.filtrarProductos(query);
}



}
