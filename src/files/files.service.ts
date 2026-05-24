import { Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import sharp from 'sharp';
import { unlink } from 'fs/promises';

export interface ProcessedFile {
  path: string;
  extension: string;
  type: 'image' | 'video';
}

@Injectable()
export class FilesService {
  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  private readonly MAX_VIDEO_SIZE = 50 * 1024 * 1024;

  async processImage(file: Express.Multer.File): Promise<string> {
    if (file.size > this.MAX_IMAGE_SIZE) {
      throw new BadRequestException('Image too large (max 5MB)');
    }

    const outputPath = `uploads/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.webp`;

    await sharp(file.path)
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(outputPath);

    await unlink(file.path);

    return outputPath;
  }

  async processVideo(file: Express.Multer.File): Promise<string> {
    if (file.size > this.MAX_VIDEO_SIZE) {
      throw new BadRequestException('Video too large (max 50MB)');
    }

    return file.path;
  }

  async processFiles(files: Express.Multer.File[]): Promise<ProcessedFile[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const results: ProcessedFile[] = [];

    await Promise.all(
      files.map(async (file) => {
        const mime = file.mimetype;

        if (mime.startsWith('image/')) {
          const processedPath = await this.processImage(file);

          results.push({
            path: processedPath,
            extension: '.webp',
            type: 'image',
          });
        } else if (mime.startsWith('video/')) {
          const processedPath = await this.processVideo(file);

          results.push({
            path: processedPath,
            extension: extname(file.originalname),
            type: 'video',
          });
        } else {
          throw new BadRequestException(`Unsupported file type: ${mime}`);
        }
      }),
    );

    return results;
  }
}
