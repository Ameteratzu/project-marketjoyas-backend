import { PrismaClient, Rol } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminEmail = 'admin@gmail.com';

  // Verificar si ya existe para no duplicar
  const existingAdmin = await prisma.usuario.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    await prisma.usuario.create({
      data: {
        nombre_completo: 'Administrador',
        email: adminEmail,
        contraseña: hashedPassword,
        rol: Rol.ADMIN,
        telefono: '000000000', // rellena con un teléfono por defecto
        // username es opcional según la tabla, para admin lo dejamos null
      }
    });

    console.log('Usuario admin creado');
  } else {
    console.log('El usuario admin ya existe');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
