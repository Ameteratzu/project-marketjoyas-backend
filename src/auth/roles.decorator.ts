// src/auth/roles.decorator.ts
//import { SetMetadata } from '@nestjs/common';/

//este decorador es para asignar que rol puede acceder a un endpoint
//export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// src/auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles'; // Clave para el reflector
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);