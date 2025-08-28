// users.controller.ts
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CrearClienteDto } from './dtos/crear-cliente.dto';
import { CrearVendedorDto } from './dtos/crear-vendedor.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsersService) {}

  @Post('registro/cliente')
  crearCliente(@Body(new ValidationPipe()) dto: CrearClienteDto) {
    return this.usuariosService.crearCliente(dto);
  }

  @Post ('registro/vendedor')
  crearVendedor(@Body(new ValidationPipe())dto: CrearVendedorDto){
    return this.usuariosService.crearVendedor(dto);
  }
}
