import {Module} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from './users.service';
import { UsuariosController } from './users.controller';

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  controllers: [UsuariosController],
})
export class UsersModule {}