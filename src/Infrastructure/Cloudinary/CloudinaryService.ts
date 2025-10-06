import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { ImageService } from '../../Domain/Services/ImageService';

export class CloudinaryService implements ImageService {

  constructor(cloud_name: string, api_key: string, api_secret: string) {
    cloudinary.config({ cloud_name, api_key, api_secret });
  }

  async uploadImage(file: Express.Multer.File, folder = 'clients') {
    return new Promise<{ id: string; url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({ id: result.public_id, url: result.secure_url });
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
