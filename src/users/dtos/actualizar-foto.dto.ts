import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarFotoDto {
  @ApiProperty({ example: 'https://res.cloudinary.com/miimagen.jpg' })
  @IsString()
  fotoPerfilUrl: string;

  @ApiProperty({ example: 'cloudinary-public-id-123 o lo que devuelva' })
  @IsString()
  fotoPerfilPublicId: string;
}
