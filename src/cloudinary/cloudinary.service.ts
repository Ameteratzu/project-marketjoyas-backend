import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import * as crypto from 'crypto';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<{ url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'imagenes' },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          if (!result?.secure_url || !result.public_id) {
            return reject(new Error('Faltan datos de Cloudinary'));
          }

          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );

      const readable = new Readable();
      readable._read = () => {};
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  async deleteImage(public_id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(public_id, (error, result) => {
        if (error) return reject(new Error(error.message));
        if (result.result !== 'ok' && result.result !== 'not found') {
          return reject(new Error(`Error eliminando imagen: ${result.result}`));
        }
        resolve();
      });
    });
  }

  // Nuevo método para generar la firma que usa el frontend
  generateSignature(): { signature: string; timestamp: number; uploadPreset: string } {
    const timestamp = Math.floor(Date.now() / 1000);
    const preset = 'ml_default';
    const stringToSign = `timestamp=${timestamp}&upload_preset=${preset}`;
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign + process.env.CLOUDINARY_API_SECRET)
      .digest('hex');

    return { signature, timestamp, uploadPreset: preset };
  }
}
