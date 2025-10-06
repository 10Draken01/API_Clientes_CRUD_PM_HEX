export interface ImageService {
  uploadImage(file: Express.Multer.File, folder: string): Promise<{ id: string; url: string }>;
  deleteImage(publicId: string): Promise<void>;
}