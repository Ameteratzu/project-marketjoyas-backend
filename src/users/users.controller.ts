// users.controller.ts
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CrearClienteDto } from './dtos/crear-cliente.dto';
import { CrearVendedorDto } from './dtos/crear-vendedor.dto';
import { GetUserOptional } from './decorators/get-user-optional.decorator';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsersService) {}

  @Post('registro/cliente')
  crearCliente(@Body(new ValidationPipe()) dto: CrearClienteDto) {
    return this.usuariosService.crearCliente(dto);
  }

  @Post('registro/vendedor')
  async crearVendedor(
    @GetUserOptional() user: any, // null si no está logueado
    @Body(new ValidationPipe()) dto: CrearVendedorDto,
  ) {
    return this.usuariosService.crearVendedor(dto, user?.sub);
  }
}
