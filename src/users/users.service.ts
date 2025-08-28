// users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearClienteDto } from './dtos/crear-cliente.dto';
import * as bcrypt from 'bcrypt';
import { CrearVendedorDto } from './dtos/crear-vendedor.dto';


///////////////////////////////EN ESTE SERVICIO ESTA LA LOGICA DE NEGOCIO DE USUARIOS/////////////////////////



@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private async hashPassword(contraseña: string) {
    return bcrypt.hash(contraseña, 10);
  }

  async crearCliente(dto: CrearClienteDto) {
    const hashed = await this.hashPassword(dto.contraseña);
    return this.prisma.usuario.create({
      data: {
        nombre_completo: dto.nombre_completo,
        email: dto.email,
        dni: dto.dni,
        telefono: dto.telefono,
        contraseña: hashed,
        direccion: dto.direccion,
        rol: 'CLIENTE', //ya viene por defecto
      },
    });
  }

  //funcion para registro de vendedores, tambien registra tienda.

async crearVendedor(dto: CrearVendedorDto) {
  const hashed = await this.hashPassword(dto.contraseña);

  return this.prisma.usuario.create({
    data: {
      nombre_completo: dto.nombre_completo,
      username: dto.username,
      email: dto.email,         
      dni: dto.dni,
      telefono: dto.telefono,
      contraseña: hashed,
      direccion: dto.direccion,
      rol: 'VENDEDOR',

      tiendaPropia: {
        create: {
          nombre: dto.tienda.nombre_tienda,  
          direccion: dto.tienda.direccion_tienda, 
          telefono: dto.tienda.telefono_tienda,   
          pais: dto.tienda.pais,                  
          ciudad: dto.tienda.ciudad,
          provincia: dto.tienda.provincia,
          codigoPostal: dto.tienda.codigoPostal
        }
      }
    },
    include: { tiendaPropia: true } 
  });
}


}


