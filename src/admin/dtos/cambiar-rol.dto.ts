import { IsEnum } from 'class-validator';
import { Rol } from '@prisma/client';

export class CambiarRol {
  @IsEnum(Rol, { message: 'Rol no válido' })
  rol: Rol;
}
