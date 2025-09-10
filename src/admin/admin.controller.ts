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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CrearAdminDto } from './dtos/crear-admin.dto';
import { AdminService } from './admin.service';
import { GetUser } from '../common/decorators/get-user.decorator';
import { CambiarRol } from './dtos/cambiar-rol.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
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
  @ApiOperation({
    summary: 'Un admin crea un nuevo admin',
  })
  async createAdmin(@Body() dto: CrearAdminDto) {
    return this.adminService.createAdmin(dto);
  }

  // Obtener lista de todos los usuarios
  @Roles('ADMIN')
  @Get('usuarios')
  @ApiOperation({
    summary: 'un admin obtiene todos los usuarios',
  })
  async findAllUsers() {
    return this.adminService.getAllUsers();
  }

  // Cambiar rol de usuario
  @Roles('ADMIN')
  @Patch('usuarios/:id/rol')
  @ApiOperation({
    summary: 'Un admin cambia el rol de cualquier usuario',
  })
  async changeUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarRol,
    @GetUser() user: JwtPayload,
  ) {
    return this.adminService.changeUserRole(id, dto.rol, user);
  }

  @Roles('ADMIN')
  @Patch('cotizaciones/:id/estado')
  @ApiOperation({
    summary: 'Un admin cambia el estado de cotizacion, la aprueba o deniega',
  })
  async cambiarEstadoCotizacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CambiarEstadoCotizacionDto,
  ) {
    return this.adminService.cambiarEstadoCotizacion(id, dto.estado);
  }

  @Roles('ADMIN')
  @Get('tiendas')
  @ApiOperation({
    summary: 'Un admin ve todas tiendas',
  })
  async getAllTiendas() {
    return this.adminService.getAllTiendas();
  }


}
