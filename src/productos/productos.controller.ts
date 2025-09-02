import { Controller, Post, Body, UseGuards, Req, Patch, Param, ParseIntPipe, Delete, Get, UseInterceptors, UploadedFile, BadRequestException, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CrearProductoDto } from './dtos/crear-producto.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UpdateProductoDto } from './dtos/actualizar-producto.dto';
import { BuscarProductoDto } from './dtos/buscar-producto.dto';



@Controller('productos')
export class ProductosController {
  constructor(
    private readonly productosService: ProductosService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  //añadir producto
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'TRABAJADOR')
  async create(@Body() dto: CrearProductoDto, @GetUser() user: JwtPayload) {
    return this.productosService.create(dto, user);
  }

  //editar producto

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'TRABAJADOR')
  @ApiBody({ type: CrearProductoDto })
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
  async habilitar(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtPayload,
  ) {
    return this.productosService.habilitarProducto(id, user);
  }

  // obtener todos los productos, acceso libre (para CLIENTES o internautas)
  @Get()
  async findAll() {
    return this.productosService.findAll();
  }

  // obtener productos por nombre (para CLIENTES o internautas)


  @Get('buscar')
  async buscarPorNombre(@Query() query: BuscarProductoDto) {
    return this.productosService.buscarPorNombrePublico(query.nombre);
  }


//obtener productos por nombre (para VENDEDORES/TRABAJADORES)
  @Get('buscar/mis-productos')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'TRABAJADOR')
  async buscarPorNombrePrivado(
    @GetUser() user: JwtPayload,
    @Query('nombre') nombre: string,
  ) {
    return this.productosService.buscarPorNombrePrivado(user, nombre);
  }

  // obtener producto por id, acceso libre (para CLIENTES o internautas)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  



  

  // subir imagenes a cloudinary
  @ApiBearerAuth()
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'TRABAJADOR')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const url = await this.cloudinaryService.uploadImage(file);
    return { url };
  } //
}

