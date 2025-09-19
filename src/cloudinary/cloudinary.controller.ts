import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinary: CloudinaryService) {}

  // Nuevo endpoint para generar la firma
 @Get('generate-signature')
@ApiOperation({ summary: 'Generar firma para subida segura a Cloudinary' })
generateSignature() {
  const { signature, timestamp, uploadPreset } = this.cloudinary.generateSignature();
  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadPreset,
  };
}


  // Subida directa desde backend (opcional)
  @Post('upload')
  @ApiOperation({ summary: 'Subir imágenes a Cloudinary desde backend' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
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