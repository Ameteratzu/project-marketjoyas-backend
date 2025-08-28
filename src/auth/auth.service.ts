// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
}
