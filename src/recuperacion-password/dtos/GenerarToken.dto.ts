import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class GenerarTokenDto {

    @ApiProperty({
        description: 'Correo electrónico del usuario para generar el token de recuperación',
        example: 'usuario@correo.com',
    })
    @IsEmail()
    email: string;
}
