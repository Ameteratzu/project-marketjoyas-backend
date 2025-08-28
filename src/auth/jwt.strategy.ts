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
