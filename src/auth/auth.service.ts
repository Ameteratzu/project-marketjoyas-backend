// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  //Validando contraseñas

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isMatch = await bcrypt.compare(pass, user.contraseña);
    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    return user;
  }

  //funcion para el logueo de usuarios

  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);

    // payload del JWT
    const payload: any = {
      sub: user.id,
      fullName: user.nombre_completo,
      email: user.email,
      rol: user.rol,
    };

    // Si es dueño de tienda (VENDEDOR)
    if (user.rol === 'VENDEDOR' && user.tiendaPropia) {
      payload.tiendaId = user.tiendaPropia.id;
    }

    // Si es trabajador de una tienda
    if (user.rol === 'TRABAJADOR' && user.tiendaId) {
      payload.tiendaId = user.tiendaId;
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: payload, //  devolver al frontend
    };
  }



  /////////////////////////////////////////OAuth//////////////////////////////


  //LOGUEARSE CON OAUTH

  async loginWithOAuth(googleUser: {
  oauthId: string;
  email: string;
  nombre_completo: string;
  proveedor: 'GOOGLE';
}) {
  // Buscar cuenta OAuth existente
  let cuentaOAuth = await this.usersService.findOAuthAccount(googleUser.oauthId, googleUser.proveedor);

  let usuario;

  if (cuentaOAuth) {
    usuario = cuentaOAuth.usuario;
  } else {
    // Buscar usuario por email
    usuario = await this.usersService.findByEmail(googleUser.email);

    if (!usuario) {
      // Crear usuario nuevo (puedes personalizar esto)
      usuario = await this.usersService.createOAuthUser({
        email: googleUser.email,
        nombre_completo: googleUser.nombre_completo,
      });
    }

    // Crear la cuenta OAuth
    await this.usersService.createOAuthAccount({
      oauthId: googleUser.oauthId,
      email: googleUser.email,
      proveedor: googleUser.proveedor,
      usuarioId: usuario.id,
    });
  }

  const payload: any = {
    sub: usuario.id,
    email: usuario.email,
    rol: usuario.rol,
    fullName: usuario.nombre_completo,
  };

  if (usuario.rol === 'VENDEDOR' && usuario.tiendaPropia) {
    payload.tiendaId = usuario.tiendaPropia.id;
  }

  if (usuario.rol === 'TRABAJADOR' && usuario.tiendaId) {
    payload.tiendaId = usuario.tiendaId;
  }

  return {
    access_token: this.jwtService.sign(payload),
    user: payload,
  };
}


}
