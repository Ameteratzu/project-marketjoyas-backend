import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { GemaModule } from './caracteristicas/gema/gema.module';
import { MaterialModule } from './caracteristicas/material/material.module';
import { OcasionModule } from './caracteristicas/ocasion/ocasion.module';
import { EstiloModule } from './caracteristicas/estilo/estilo.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [GemaModule, MaterialModule, OcasionModule, EstiloModule],
})
export class AdminModule {}
