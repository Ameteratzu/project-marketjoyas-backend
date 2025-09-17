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
  Query,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CrearProductoDto } from './dtos/crear-producto.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import { UpdateProductoDto } from './dtos/actualizar-producto.dto';
import { BuscarProductoDto } from './dtos/buscar-producto.dto';
import { CategoriaIdDto } from './dtos/categoria-id.dto';
import { FiltrarProductosDto } from './dtos/filtrar-productos.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // Crear producto
  @Post()
  @ApiBearerAuth()
  @Roles('VENDEDOR', 'TRABAJADOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Un VENDEDOR o TRABAJADOR añaden un producto',
  })
  async create(@Body() dto: CrearProductoDto, @GetUser() user: JwtPayload) {
    return this.productosService.create(dto, user);
  }

  // Obtener todos los productos (público)
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los productos (público)',
  })
  async findAll() {
    return this.productosService.findAll();
  }

  // Buscar productos por nombre (público)
  @Get('buscar')
  @ApiOperation({
    summary: 'Buscar productos por nombre (público)',
  })
  async buscarPorNombre(@Query() query: BuscarProductoDto) {
    return this.productosService.buscarPorNombrePublico(query.nombre);
  }

  // Filtrar productos desde backend (público)
  @Get('filtrar')
  @ApiOperation({
    summary: 'Filtrar productos (backend)',
  })
  filtrarProductos(@Query() query: FiltrarProductosDto) {
    return this.productosService.filtrarProductos(query);
  }

  // Obtener productos por categoría (público)
  @Get('categoria/:categoriaId')
  @ApiOperation({
    summary: 'Obtener productos por categoría (público)',
  })
  async findByCategoryPublic(@Param() params: CategoriaIdDto) {
    return this.productosService.findByCategoryPublic(params.categoriaId);
  }

  // Obtener productos por tienda (privado)
  @Get('mis-productos')
  @ApiBearerAuth()
  @Roles('VENDEDOR', 'TRABAJADOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Obtener productos de la tienda del VENDEDOR o TRABAJADOR',
  })
  async findByTienda(@GetUser() user: JwtPayload) {
    return this.productosService.findByTienda(user);
  }

  // Buscar productos por nombre (privado)
  @Get('buscar/mis-productos')
  @ApiBearerAuth()
  @Roles('VENDEDOR', 'TRABAJADOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Buscar productos por nombre (solo productos de su tienda)',
  })
  async buscarPorNombrePrivado(
    @GetUser() user: JwtPayload,
    @Query('nombre') nombre: string,
  ) {
    return this.productosService.buscarPorNombrePrivado(user, nombre);
  }

  // Filtrar por categoría (privado)
  @Get('categoria/mis-productos/:categoriaId')
  @ApiBearerAuth()
  @Roles('VENDEDOR', 'TRABAJADOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Obtener productos por categoría (vendedor/trabajador)',
  })
  async findByCategoryPrivate(
    @GetUser() user: JwtPayload,
    @Param() params: CategoriaIdDto,
  ) {
    return this.productosService.findByCategoryPrivate(params.categoriaId, user);
  }

  // Habilitar producto
  @Patch(':id/habilitar')
  @ApiBearerAuth()
  @Roles('VENDEDOR', 'TRABAJADOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Un VENDEDOR o TRABAJADOR habilitan un producto de su tienda',
  })
  async habilitar(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtPayload,
  ) {
    return this.productosService.habilitarProducto(id, user);
  }

  // Editar producto
  @Patch(':id')
  @ApiBearerAuth()
  @Roles('VENDEDOR', 'TRABAJADOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  // Eliminar producto (soft delete)
  @Delete(':id')
  @ApiBearerAuth()
  @Roles('VENDEDOR', 'TRABAJADOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Deshabilita (soft delete) un producto de la tienda',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtPayload,
  ) {
    return this.productosService.remove(id, user);
  }

  // Obtener producto por ID (público)
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener producto por ID (público)',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }
}
