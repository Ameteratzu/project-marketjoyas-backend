import { PartialType } from '@nestjs/swagger';
import { CrearProductoDto } from './crear-producto.dto';

export class UpdateProductoDto extends PartialType(CrearProductoDto) {}
