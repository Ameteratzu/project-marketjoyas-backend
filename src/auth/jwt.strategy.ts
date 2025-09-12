//jwt.strategy.ts


//esto sirve basicamente para validar el token, cuando un usuario se loguea genera un token con payload
//cuando el usuario hace uso de un endpoint manda su token y JwtStrategy lo valida 

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!, 
    });
  }

  async validate(payload: any) {
    // Lo que se devuelve aqui estara disponible en req.user
    if (!payload) throw new UnauthorizedException();
    return payload;
  }
}

//jwt.strategy.ts AL FINAL NO APLIQUE ESTE CAMBIO PERO QUEDA AQUI


//esto sirve basicamente para validar el token, cuando un usuario se loguea genera un token con payload
//cuando el usuario hace uso de un endpoint manda su token y JwtStrategy lo valida 

//cambiado 12/09/25
/*

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface'; // ajusta la ruta según tu proyecto

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (!payload || !payload.sub || !payload.email || !payload.rol) {
      throw new UnauthorizedException('Token inválido');
    }
    return payload;
  }
}
*/

// Se valida que el payload tenga los campos mínimos requeridos.
// Asegúrate que el token siempre incluya sub, email y rol.
// No valida estado del usuario ni existencia en BD (puede mejorarse).
// Cambios futuros en la interfaz JwtPayload deben reflejarse aquí.

// Posibles errores futuros:
// - Si JwtPayload cambia y no se actualiza esta validación, puede causar fallos.
// - No verifica si el usuario existe o está activo en la base de datos.
// - Si faltan campos obligatorios en el token, lanza UnauthorizedException.
// - No maneja roles o permisos más detallados aquí, eso va en guards.
