// users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearClienteDto } from './dtos/crear-cliente.dto';
import * as bcrypt from 'bcrypt';
import { CrearVendedorDto } from './dtos/crear-vendedor.dto';
import { Prisma, Usuario } from 'generated/prisma';

///////////////////////////////EN ESTE SERVICIO ESTA LA LOGICA DE NEGOCIO DE USUARIOS/////////////////////////


//type para que prisma reconozca las relaciones y no solo los campos de Usuario
//lo uso en findByEmail

 type UsuarioConTienda = Prisma.UsuarioGetPayload<{
    include: { tiendaPropia: true };
  }>;


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

  //funcion para registro de VENDEDORES, tambien registra tienda y actualiza datos si el usuario
  // es CLIENTE.

  async crearVendedor(dto: CrearVendedorDto, userId?: number) {
  const hashed = await this.hashPassword(dto.contraseña);

  if (userId) {
    // Usuario existente, actualiza datos
    return this.prisma.usuario.update({
      where: { id: userId },
      data: {
        rol: 'VENDEDOR',
        nombre_completo: dto.nombre_completo,
        email: dto.email,
        username: dto.username,
        dni: dto.dni,
        telefono: dto.telefono,
        contraseña: hashed,
        direccion: dto.direccion,
        tiendaPropia: {
          create: {
            nombre: dto.tienda.nombre_tienda,
            direccion: dto.tienda.direccion_tienda,
            telefono: dto.tienda.telefono_tienda,
            pais: dto.tienda.pais,
            ciudad: dto.tienda.ciudad,
            provincia: dto.tienda.provincia,
            codigoPostal: dto.tienda.codigoPostal,
          },
        },
      },
      include: { tiendaPropia: true },
    });
  }

  // Usuario nuevo, lo registra de 0
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
          codigoPostal: dto.tienda.codigoPostal,
        },
      },
    },
    include: { tiendaPropia: true },
  });
}




  //Funcion para buscar por email.

  //busco usuario por email, incluyo relacion de tienda propia ya que si el usuario es vendedor
  //al momento de loguearse se debe saber a que tienda pertenece.

   async findByEmail(email: string): Promise<UsuarioConTienda | null> {
    return this.prisma.usuario.findUnique({
      where: { email },
      include: {
        tiendaPropia: true, // si es vendedor cargamos la tienda
      },
    });
  }


}
