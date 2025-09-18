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
import { CrearPrimerAdminDto } from './dtos/crear-admin.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsersService) {}


  //REGISTRO DE NUEVO USUARIO CLIENTE

  @Post('registro/cliente')
  crearCliente(@Body(new ValidationPipe()) dto: CrearClienteDto) {
    return this.usuariosService.crearCliente(dto);
  }

  //REGISTROPARA VENDEDOR (DESAROLLO)

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


  //UN VENDEDOR REGISTRA UN NUEVO USUARIO

  @ApiBearerAuth()
  @Roles('VENDEDOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('registro/trabajador')
  async crearTrabajador(
    @GetUser() user: JwtPayload,
    @Body() dto: CrearTrabajadorDto,
  ) {
    return this.usuariosService.crearTrabajador(dto, user);
  }


  ///ACTUALIZAR INFORMACION DE USUARIO

  @Patch('actualizar/info')
  @ApiBearerAuth()
  @Roles('CLIENTE','ADMIN','DEMOVENDEDOR','VENDEDOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Actualiza toda la info de un cliente',
  })
  actualizarInfo(
    @GetUser() user: JwtPayload,
    @Body(new ValidationPipe()) dto: ActualizarInfoDto,
  ) {
    return this.usuariosService.actualizarInfo(user.sub, dto);
  }

  //UN USUARIO ACTUALIZA SU DIRECCION PRINCIPAL

  @Patch('actualizar/direccion')
  @ApiBearerAuth()
  @Roles('CLIENTE','ADMIN','DEMOVENDEDOR','VENDEDOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Actualiza especificamente la direccion legal de un usuario',
  })
  actualizarDireccion(
    @GetUser() user: JwtPayload,
    @Body(new ValidationPipe()) dto: ActualizarDireccionDto,
  ) {
    return this.usuariosService.actualizarDireccion(user.sub, dto);
  }



  //ACTUALIZA LA FOTO DE UN USUARIO

  @Patch('actualizar/foto')
  @ApiBearerAuth()
  @Roles('CLIENTE','ADMIN','DEMOVENDEDOR','VENDEDOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Actualiza especificamente la foto de un usuario',
  })
  actualizarFotoPerfil(
    @GetUser() user: JwtPayload,
    @Body(new ValidationPipe()) dto: ActualizarFotoDto,
  ) {
    return this.usuariosService.actualizarFotoPerfil(user.sub, dto);
  }


  //REGISTRA NUEVO ADMIN

  @Post('registro/admin')
  @ApiOperation({ summary: 'Crea un nuevo usuario ADMIN' })
  crearAdmin(@Body(new ValidationPipe()) dto: CrearPrimerAdminDto) {
    return this.usuariosService.crearAdmin(dto);
  }
}
