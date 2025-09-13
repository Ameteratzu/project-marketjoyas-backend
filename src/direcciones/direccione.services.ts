import {
  Injectable,
  ForbiddenException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearDireccion } from './dtos/crear-direccion.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';


@Injectable()
export class DireccionesService{
    constructor(private prisma: PrismaService){}

    //Funcion para crear nuevas direcciones
    async create(dto: CrearDireccion, user: JwtPayload){
        if(user.sub !== dto.usuarioId){
            throw new ForbiddenException('No puedes agregar dirección a otro usuario');
        }
        return this.prisma.direccionAdicional.create({
            data: {
                direccion: dto.direccion,
                departamento: dto.departamento,
                provincia: dto.provincia,
                distrito: dto.distrito,
                tipoDireccion: dto.tipoDireccion,
                usuario: {
                    connect: { id: dto.usuarioId }
                }
                
            }
        })
    }
}