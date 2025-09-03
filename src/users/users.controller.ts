// users.controller.ts
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CrearClienteDto } from './dtos/crear-cliente.dto';
import { CrearVendedorDto } from './dtos/crear-vendedor.dto';
import { GetUserOptional } from './decorators/get-user-optional.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { CrearTrabajadorDto } from './dtos/crear-trabajador.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

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


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR')
  @Post('registro/trabajador')
  async crearTrabajador(
    @GetUser() user: JwtPayload,
    @Body() dto: CrearTrabajadorDto,
  ) {
    return this.usuariosService.crearTrabajador(dto, user);
  }
}
