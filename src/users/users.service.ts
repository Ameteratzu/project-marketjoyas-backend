// users/users.service.ts
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearClienteDto } from './dtos/crear-cliente.dto';
import * as bcrypt from 'bcrypt';
import { CrearVendedorDto } from './dtos/crear-vendedor.dto';
import { Prisma, Usuario } from '@prisma/client';
import { CrearTrabajadorDto } from './dtos/crear-trabajador.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CrearDemoVendedorDto } from './dtos/crear-demo-vendedor.dto';
import { ActualizarFotoDto } from './dtos/actualizar-foto.dto';
import { ActualizarDireccionDto } from './dtos/actualizar-direccion.dto';
import { ActualizarInfoDto } from './dtos/actualizar-info.dto';
import { CrearPrimerAdminDto } from './dtos/crear-admin.dto';

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
        ...(dto.direccion && { direccion: dto.direccion }), // <--- solo si viene direccion
        rol: 'CLIENTE',
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

  async crearDemoVendedor(dto: CrearDemoVendedorDto, userId?: number) {
    const hashedPassword = await this.hashPassword(dto.contraseña);

    if (userId) {
      const user = await this.prisma.usuario.findUnique({
        where: { id: userId },
      });

      if (user?.rol !== 'CLIENTE') {
        throw new ForbiddenException(
          'Solo los usuarios CLIENTE pueden registrarse como DEMOVENDEDOR',
        );
      }

      return this.prisma.usuario.update({
        where: { id: userId },
        data: {
          rol: 'DEMOVENDEDOR',
          nombre_completo: dto.nombre_completo,
          email: dto.email,
          telefono: dto.telefono,
          contraseña: hashedPassword,
          direccion: dto.direccion,
          tiendaPropia: {
            create: {
              nombre: dto.nombre_tienda,
              direccion: dto.direccion_tienda,
              departamento: dto.departamento,
              provincia: dto.provincia,
              distrito: dto.distrito,
            },
          },
        },
        include: { tiendaPropia: true },
      });
    }

    // Usuario nuevo
    return this.prisma.usuario.create({
      data: {
        nombre_completo: dto.nombre_completo,
        email: dto.email,
        telefono: dto.telefono,
        contraseña: hashedPassword,
        direccion: dto.direccion,
        rol: 'DEMOVENDEDOR',
        tiendaPropia: {
          create: {
            nombre: dto.nombre_tienda,
            direccion: dto.direccion_tienda,
            departamento: dto.departamento,
            provincia: dto.provincia,
            distrito: dto.distrito,
          },
        },
      },
      include: { tiendaPropia: true },
    });
  }

  //Funcion para crear trabajador

  async crearTrabajador(dto: CrearTrabajadorDto, creador: JwtPayload) {
    if (creador.rol !== 'VENDEDOR') {
      throw new ForbiddenException(
        'Solo un vendedor puede registrar trabajadores',
      );
    }

    if (!creador.tiendaId) {
      throw new ForbiddenException('El vendedor no tiene una tienda asociada');
    }

    const yaExiste = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (yaExiste) {
      throw new ForbiddenException('El email ya está registrado');
    }

    const hashed = await this.hashPassword(dto.contraseña);

    const trabajador = await this.prisma.usuario.create({
      data: {
        nombre_completo: dto.nombre_completo,
        email: dto.email,
        contraseña: hashed,
        telefono: dto.telefono,
        dni: dto.dni,
        rol: 'TRABAJADOR',
        tiendaId: creador.tiendaId,
      },
    });

    return {
      message: 'Trabajador registrado correctamente',
      trabajador,
    };
  }

  ///CREAR ADMIN


  async crearAdmin(dto: CrearPrimerAdminDto) {
  const existe = await this.prisma.usuario.findUnique({
    where: { email: dto.email },
  });

  if (existe) {
    throw new ForbiddenException('Ya existe un usuario con este email');
  }

  const hashed = await this.hashPassword(dto.contraseña);

  return this.prisma.usuario.create({
    data: {
      nombre_completo: dto.nombre_completo,
      email: dto.email,
      dni: dto.dni,
      telefono: dto.telefono,
      contraseña: hashed,
      ...(dto.direccion && { direccion: dto.direccion }),
      rol: 'ADMIN',
    },
  });
}

  ///////////////////////////////////////ACTUALIZAR INFORMACION///////////////////////////////////////////////////////////

  async actualizarInfo(userId: number, dto: ActualizarInfoDto) {
  const usuario = await this.prisma.usuario.findUnique({
    where: { id: userId },
  });
  if (!usuario) throw new ForbiddenException('Usuario no encontrado');

  const updateData: any = {
    nombre_completo: dto.nombre_completo,
    dni: dto.dni,
    telefono: dto.telefono,
    email: dto.email,
  };

  // Validar y actualizar contraseña si se desea cambiar
  if (dto.nueva_contraseña) {
    if (usuario.contraseña && usuario.contraseña.length > 0) {
      // Usuario tiene contraseña, validar la actual
      if (!dto.contraseña_actual) {
        throw new ForbiddenException('Debe proporcionar la contraseña actual');
      }
      const match = await bcrypt.compare(dto.contraseña_actual, usuario.contraseña);
      if (!match) throw new ForbiddenException('La contraseña actual es incorrecta');
    }
    // Si no tiene contraseña, puede establecerla sin validar
    updateData.contraseña = await this.hashPassword(dto.nueva_contraseña);
  }

  return this.prisma.usuario.update({
    where: { id: userId },
    data: updateData,
  });
}


  async actualizarDireccion(userId: number, dto: ActualizarDireccionDto) {
    return this.prisma.usuario.update({
      where: { id: userId },
      data: { direccion: dto.direccion },
    });
  }

  async actualizarFotoPerfil(userId: number, dto: ActualizarFotoDto) {
    return this.prisma.usuario.update({
      where: { id: userId },
      data: {
        fotoPerfilUrl: dto.fotoPerfilUrl,
        fotoPerfilPublicId: dto.fotoPerfilPublicId,
      },
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


  ////////////////OAUTH////////////

  
async findOAuthAccount(oauthId: string, proveedor: 'GOOGLE') {
  return this.prisma.cuentaOAuth.findUnique({
    where: {
      proveedor_oauthId: {
        proveedor,
        oauthId,
      },
    },
    include: {
      usuario: true,
    },
  });
}

async createOAuthAccount(data: {
  oauthId: string;
  email: string;
  proveedor: 'GOOGLE';
  usuarioId: number;
}) {
  return this.prisma.cuentaOAuth.create({ data });
}

async createOAuthUser(data: { email: string; nombre_completo: string }) {
  return this.prisma.usuario.create({
    data: {
      email: data.email,
      nombre_completo: data.nombre_completo,
      contraseña: '',  //la podra cambiar en sus configuraciones
      rol: 'CLIENTE', 
      telefono: '0000000000', // luego lo cambia en sus configuraciones

    },
  });
}
}
