// users.controller.ts
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CrearClienteDto } from './dtos/crear-cliente.dto';
import { CrearVendedorDto } from './dtos/crear-vendedor.dto';
import { GetUserOptional } from './decorators/get-user-optional.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CrearTrabajadorDto } from './dtos/crear-trabajador.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CrearDemoVendedorDto } from './dtos/crear-demo-vendedor.dto';
import { ActualizarFotoDto } from './dtos/actualizar-foto.dto';
import { ActualizarDireccionDto } from './dtos/actualizar-direccion.dto';
import { ActualizarInfoDto } from './dtos/actualizar-info.dto';

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

  // Para formulario unete a nosotros DEMOVENDEDOR
  @Post('registro/demovendedor')
  @ApiOperation({
    summary:
      'Para crear usuario de DEMOVENDEDOR, se usa en formulario de UNETE A NOSOTROS',
  })
  async crearDemoVendedor(
    @GetUserOptional() user: JwtPayload, // puede ser null si no hay sesión
    @Body(new ValidationPipe()) dto: CrearDemoVendedorDto,
  ) {
    return this.usuariosService.crearDemoVendedor(dto, user?.sub);
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

  @Patch('actualizar/info')
  @ApiBearerAuth()
   @ApiOperation({
    summary:
      'Actualiza toda la info de un cliente',
  })

  @UseGuards(JwtAuthGuard)
  actualizarInfo(
    @GetUser() user: JwtPayload,
    @Body(new ValidationPipe()) dto: ActualizarInfoDto,
  ) {
    return this.usuariosService.actualizarInfo(user.sub, dto);
  }

  @Patch('actualizar/direccion')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Actualiza especificamente la direccion de un usuario',
  })

  @UseGuards(JwtAuthGuard)
  actualizarDireccion(
    @GetUser() user: JwtPayload,
    @Body(new ValidationPipe()) dto: ActualizarDireccionDto,
  ) {
    return this.usuariosService.actualizarDireccion(user.sub, dto);
  }

  @Patch('actualizar/foto')
  @ApiBearerAuth()
   @ApiOperation({
    summary:
      'Actualiza especificamente la foto de un usuario',
  })

  @UseGuards(JwtAuthGuard)
  actualizarFotoPerfil(
    @GetUser() user: JwtPayload,
    @Body(new ValidationPipe()) dto: ActualizarFotoDto,
  ) {
    return this.usuariosService.actualizarFotoPerfil(user.sub, dto);
  }
}
