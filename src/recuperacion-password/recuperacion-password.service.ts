import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt'; // solo bcrypt para hashear la contraseña

@Injectable()
export class RecuperacionPasswordService {
  constructor(private readonly prisma: PrismaService) {}

  // Generar token y mostrar enlace de recuperación en consola
  async generarToken(email: string) {
    if (!email) throw new BadRequestException('Se requiere el email');
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const token = randomBytes(32).toString('hex');

    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + 1);

    await this.prisma.recuperacionContraseña.upsert({
      where: { usuarioId: usuario.id },
      update: { token, expiracion, usado: false, creadoEn: new Date() },
      create: { usuarioId: usuario.id, token, expiracion },
    });

    const url = `https://tu-sitio.com/reset-password?token=${token}`;

    // Para pruebas: mostrar enlace en consola en lugar de enviar correo
    console.log(`Enlace de recuperación para ${email}: ${url}`);

    return { message: 'Enlace de recuperación generado (revisar consola)' };
  }

  // Validar token antes de cambiar contraseña
  async validarToken(token: string) {
    if (!token) throw new BadRequestException('Se requiere el token');
    const registro = await this.prisma.recuperacionContraseña.findUnique({
      where: { token },
      include: { usuario: true },
    });

    if (!registro) throw new NotFoundException('Token inválido');
    if (registro.usado) throw new BadRequestException('Token ya usado');
    if (registro.expiracion < new Date()) throw new BadRequestException('Token expirado');

    return registro.usuario;
  }

  // Cambiar contraseña
  async cambiarContrasena(token: string, nuevaContrasena: string) {
    if (!token || !nuevaContrasena) {
            throw new BadRequestException('Token y nueva contraseña son requeridos');
        }
    const registro = await this.prisma.recuperacionContraseña.findUnique({
      where: { token },
      include: { usuario: true },
    });

    if (!registro) throw new NotFoundException('Token inválido');
    if (registro.usado) throw new BadRequestException('Token ya usado');
    if (registro.expiracion < new Date()) throw new BadRequestException('Token expirado');

    // Hashear la contraseña antes de guardarla
    const hash = await bcrypt.hash(nuevaContrasena, 10);

    await this.prisma.usuario.update({
      where: { id: registro.usuarioId },
      data: { contraseña: hash }, // Cambié a 'password' que suele ser el campo correcto
    });

    await this.prisma.recuperacionContraseña.update({
      where: { id: registro.id },
      data: { usado: true },
    });

    return { message: 'Contraseña actualizada correctamente' };
  }
}
