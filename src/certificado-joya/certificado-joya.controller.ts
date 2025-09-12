// certificado-joya.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  Get,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CertificadoJoyaService } from './certificado-joya.service';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CrearCertificadoJoyaDto } from './dtos/crear-certificado-joya.dto';
import { ActualizarCertificadoJoyaDto } from './dtos/actualizar-certificado-joya.dto';

@ApiTags('Certificados de joyas')
@ApiBearerAuth()
@Controller('certificados-joyas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('VENDEDOR')
export class CertificadoJoyaController {
  constructor(private readonly certificadoService: CertificadoJoyaService) {}

  @Post()
  async create(
    @GetUser() user: JwtPayload,
    @Body() dto: CrearCertificadoJoyaDto,
  ) {
    return this.certificadoService.create(user.tiendaId!, dto);
  }

  @Get()
async findAll() {
  return this.certificadoService.findAll();
}

@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.certificadoService.findOne(id);
}


@Patch(':id')
async update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: ActualizarCertificadoJoyaDto,
) {
  return this.certificadoService.update(id, dto);
}

@Delete(':id')
async remove(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.certificadoService.remove(id);
}

}
