import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DocumentoService } from './documento.service';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { GenerarDocumentoDto } from './dtos/generar-documento.dto';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('documento')
export class DocumentoController {
  constructor(private readonly documentoService: DocumentoService) {}

  @Post('generar/:pedidoId')
  @Roles('VENDEDOR', 'TRABAJADOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generar boleta o factura desde pedido' })
  async generarDocumento(
    @Param('pedidoId', ParseIntPipe) pedidoId: number,
    @Body() dto: GenerarDocumentoDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.documentoService.crearDocumentoDesdePedido(pedidoId, dto, user);
  }
}
