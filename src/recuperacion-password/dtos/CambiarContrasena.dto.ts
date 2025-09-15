import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CambiarContrasenaDto {
  @ApiProperty({
    description: 'Token recibido en el enlace de recuperación',
    example: '3f9a8b2c4d5e6f7g8h9i0j1k2l3m4n5o',
  })
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'Nueva contraseña del usuario (mínimo 6 caracteres)',
    example: 'miNuevaClave123',
  })
  @IsNotEmpty()
  @MinLength(6)
  nuevaContrasena: string;
}
