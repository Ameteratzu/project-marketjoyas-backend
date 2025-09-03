import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CrearAdminDto } from './dtos/crear-admin.dto';
import { AdminService } from './admin.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CambiarRol } from './dtos/cambiar-rol.dto';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { CambiarEstadoCotizacionDto } from './dtos/cambiar-estado-cotizacion.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Crear nuevo admin
  @Roles('ADMIN')
  @Post('crear-admin')
  async createAdmin(@Body() dto: CrearAdminDto) {
    return this.adminService.createAdmin(dto);
  }

  // Obtener lista de todos los usuarios
  @Roles('ADMIN')
  @Get('usuarios')
  async findAllUsers() {
    return this.adminService.getAllUsers();
  }

  // Cambiar rol de usuario
  @Roles('ADMIN')
  @Patch('usuarios/:id/rol')
  async changeUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarRol,
    @GetUser() user: JwtPayload,
  ) {
    return this.adminService.changeUserRole(id, dto.rol, user);
  }

  @Roles('ADMIN')
  @Patch('cotizaciones/:id/estado')
  async cambiarEstadoCotizacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarEstadoCotizacionDto,
  ) {
    return this.adminService.cambiarEstadoCotizacion(id, dto.estado);
  }

  @Roles('ADMIN')
  @Get('tiendas')
  async getAllTiendas() {
    return this.adminService.getAllTiendas();
  }
}
