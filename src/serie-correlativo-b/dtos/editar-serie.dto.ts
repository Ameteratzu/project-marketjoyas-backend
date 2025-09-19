import { PartialType } from '@nestjs/swagger';
import { CrearSerieDto } from './crear-serie.dto';

export class EditarSerieDto extends PartialType(CrearSerieDto) {}
