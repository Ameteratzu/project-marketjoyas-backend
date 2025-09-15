import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidarTokenDto {
  @ApiProperty({
    description: 'Token recibido en el enlace de recuperación',
    example: '3f9a8b2c4d5e6f7g8h9i0j1k2l3m4n5o',
  })
  @IsNotEmpty()
  token: string;
}
