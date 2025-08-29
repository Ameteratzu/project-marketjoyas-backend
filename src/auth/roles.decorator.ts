// src/auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

//este decorador es para asignar que rol puede acceder a un endpoint
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
