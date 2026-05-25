import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { extname, join } from 'path';
import sharp from 'sharp';
import { unlink } from 'fs/promises';
import * as fs from 'fs';

export interface ProcessedFile {
  path: string;
  extension: string;
  type: 'image' | 'video';
}

@Injectable()
export class FilesService {
  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  private readonly MAX_VIDEO_SIZE = 50 * 1024 * 1024;

  private readonly uploadDir = 'uploads';

  private validateFileExists(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
  }

  private validateSize(file: Express.Multer.File) {
    if (typeof file.size !== 'number') {
      throw new BadRequestException('Invalid file size');
    }
  }

  private validateMime(file: Express.Multer.File) {
    if (!file.mimetype) {
      throw new BadRequestException('Missing file mimetype');
    }
  }

  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /* =========================
     IMAGE
  ========================= */
  async processImage(file: Express.Multer.File): Promise<string> {
    this.validateFileExists(file);
    this.validateSize(file);
    this.validateMime(file);

    if (file.size > this.MAX_IMAGE_SIZE) {
      throw new BadRequestException('Image too large (max 5MB)');
    }

    const input = file.buffer ?? file.path;

    if (!input) {
      throw new BadRequestException('Invalid image input');
    }

    this.ensureUploadDir();

    const outputPath = join(
      this.uploadDir,
      `${Date.now()}-${Math.random().toString(36).substring(2)}.webp`,
    );

    try {
      await sharp(input)
        .resize({ width: 1280, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(outputPath);

      if (file.path) {
        await unlink(file.path).catch(() => {});
      }

      return outputPath;
    } catch (err) {
      throw new BadRequestException('Image processing failed');
    }
  }

  /* =========================
     VIDEO
  ========================= */
  async processVideo(file: Express.Multer.File): Promise<string> {
    this.validateFileExists(file);
    this.validateSize(file);
    this.validateMime(file);

    if (file.size > this.MAX_VIDEO_SIZE) {
      throw new BadRequestException('Video too large (max 50MB)');
    }

    if (!file.path) {
      throw new BadRequestException('Video storage path missing');
    }

    return file.path;
  }

  /* =========================
     MAIN BATCH (WITH ROLLBACK)
  ========================= */
  async processFiles(files: Express.Multer.File[]): Promise<ProcessedFile[]> {
    if (!files?.length) {
      throw new BadRequestException('No files provided');
    }

    const createdFiles: string[] = [];

    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const mime = file.mimetype;

          if (mime?.startsWith('image/')) {
            const processedPath = await this.processImage(file);
            createdFiles.push(processedPath);

            return {
              path: processedPath,
              extension: '.webp',
              type: 'image' as const,
            };
          }

          if (mime?.startsWith('video/')) {
            const processedPath = await this.processVideo(file);
            createdFiles.push(processedPath);

            return {
              path: processedPath,
              extension: extname(file.originalname),
              type: 'video' as const,
            };
          }

          throw new BadRequestException(`Unsupported file type: ${mime}`);
        }),
      );

      return results;
    } catch (err) {
      /* =========================
         ROLLBACK FILES
      ========================= */
      await Promise.all(
        createdFiles.map((filePath) => unlink(filePath).catch(() => {})),
      );

      throw new InternalServerErrorException(
        'File processing failed. Uploaded files were rolled back.',
      );
    }
  }
}
