import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {

    constructor(private readonly cloudinary: CloudinaryService){}



// subir imagenes a cloudinary
@Post('upload')
  @ApiOperation({ summary: 'Subir imágenes a Cloudinary' })
  @ApiConsumes('multipart/form-data') // 👈 necesario para que Swagger sepa que es form-data
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // 👈 le indica a Swagger que es un archivo
        },
      },
    },
  })
@UseInterceptors(FileInterceptor('file'))
async uploadImage(@UploadedFile() file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException('No se subió ningún archivo');
  }

  const { url, public_id } = await this.cloudinary.uploadImage(file);
  return { url, public_id }; 
}

}
