import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageCompressionService {
  private readonly logger = new Logger(ImageCompressionService.name);

  /**
   * Compress a single uploaded image file in-place.
   * Converts to WebP for smaller size, keeps original filename but changes extension.
   * Returns the new file path and filename.
   */
  async compressImage(
    filePath: string,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    } = {},
  ): Promise<{ newPath: string; newFilename: string }> {
    const { maxWidth = 1200, maxHeight = 1200, quality = 80 } = options;

    try {
      const dir = path.dirname(filePath);
      const ext = path.extname(filePath);
      const baseName = path.basename(filePath, ext);
      const webpFilename = `${baseName}.webp`;
      const webpPath = path.join(dir, webpFilename);

      // Read original file size for logging
      const originalSize = fs.statSync(filePath).size;

      // Process with sharp: resize if too large + convert to WebP
      await sharp(filePath)
        .resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality })
        .toFile(webpPath);

      const newSize = fs.statSync(webpPath).size;
      const savings = Math.round(
        ((originalSize - newSize) / originalSize) * 100,
      );

      this.logger.log(
        `Compressed: ${path.basename(filePath)} → ${webpFilename} | ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% saved)`,
      );

      // Remove original file
      try {
        fs.unlinkSync(filePath);
      } catch {
        // Ignore if can't delete original
      }

      return { newPath: webpPath, newFilename: webpFilename };
    } catch (error) {
      this.logger.warn(
        `Compression failed for ${filePath}, keeping original: ${error.message}`,
      );
      // Return original on failure
      return {
        newPath: filePath,
        newFilename: path.basename(filePath),
      };
    }
  }

  /**
   * Compress multiple uploaded files.
   * Returns array of { newPath, newFilename } in same order.
   */
  async compressImages(
    filePaths: string[],
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    } = {},
  ): Promise<{ newPath: string; newFilename: string }[]> {
    return Promise.all(
      filePaths.map((fp) => this.compressImage(fp, options)),
    );
  }

  /**
   * Compress for profile avatars (smaller dimensions, higher quality)
   */
  async compressAvatar(
    filePath: string,
  ): Promise<{ newPath: string; newFilename: string }> {
    return this.compressImage(filePath, {
      maxWidth: 400,
      maxHeight: 400,
      quality: 85,
    });
  }

  /**
   * Compress for national ID images (preserve more detail)
   */
  async compressNationalId(
    filePath: string,
  ): Promise<{ newPath: string; newFilename: string }> {
    return this.compressImage(filePath, {
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 85,
    });
  }

  /**
   * Compress for auction/product images
   */
  async compressProductImage(
    filePath: string,
  ): Promise<{ newPath: string; newFilename: string }> {
    return this.compressImage(filePath, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 75,
    });
  }

  /**
   * Compress for home page / banner images
   */
  async compressHomeImage(
    filePath: string,
  ): Promise<{ newPath: string; newFilename: string }> {
    return this.compressImage(filePath, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 80,
    });
  }
}
