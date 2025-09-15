import { PartialType } from '@nestjs/swagger';
import { CrearDireccion } from './crear-direccion.dto';

export class UpdateDireccion extends PartialType(CrearDireccion) {}
//