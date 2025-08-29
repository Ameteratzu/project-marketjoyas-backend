// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';


// Esta clase valida @Roles('X'), verifica que el usuario que este haciendo la peticion
//pertenezca al rol declarado.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) return true; 

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.rol) throw new ForbiddenException('No tienes acceso');

    const hasRole = requiredRoles.includes(user.rol);
    if (!hasRole) throw new ForbiddenException('No tienes permisos para este recurso');

    return true;
  }
}
