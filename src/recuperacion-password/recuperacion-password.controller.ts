import { Controller, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { RecuperacionPasswordService } from './recuperacion-password.service';
import { GenerarTokenDto } from './dtos/GenerarToken.dto';
import { ValidarTokenDto } from './dtos/ValidarToken.dto';
import { CambiarContrasenaDto } from './dtos/CambiarContrasena.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('recuperacion-password')
export class RecuperacionPasswordController {
    constructor(private readonly recuperacionService: RecuperacionPasswordService) { }

    // Endpoint para generar token (simula envío de correo)
    // POST /recuperacion-password/generar-token
    @Post('generar-token')
    @ApiOperation({
        summary: 'Generar token de recuperación',
        description: 'Genera un token para restablecer la contraseña del usuario y lo muestra en consola (simula envío de correo).',
    })
    async generarToken(@Body() dto: GenerarTokenDto) {

        return this.recuperacionService.generarToken(dto.email);
    }

    // Endpoint para validar token antes de cambiar contraseña
    // GET /recuperacion-password/validar-token?token=abc123
    @Post('validar-token')
    @ApiOperation({
        summary: 'Validar token de recuperación',
        description: 'Valida que el token enviado por el usuario sea válido y no esté expirado o usado.',
    })
    async validarToken(@Body() dto: ValidarTokenDto) {

        return this.recuperacionService.validarToken(dto.token);
    }

    // Endpoint para cambiar contraseña
    // POST /recuperacion-password/cambiar-contrasena
    // Body: { token: string, nuevaContrasena: string }
    @Post('cambiar-contrasena')
    @ApiOperation({
        summary: 'Cambiar contraseña',
        description: 'Cambia la contraseña del usuario usando el token de recuperación y marca el token como usado.',
    })
    async cambiarContrasena(@Body() dto: CambiarContrasenaDto) {

        return this.recuperacionService.cambiarContrasena(dto.token, dto.nuevaContrasena);
    }
}
