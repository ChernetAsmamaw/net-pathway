// net-pathway-backend/src/utils/cloudinaryService.ts
import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse, UploadApiOptions } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

interface UploadOptions {
  folder?: string;
  public_id?: string;
  overwrite?: boolean;
  resource_type?: "auto" | "image" | "video" | "raw"; // Match Cloudinary's expected types
  transformation?: any[];
}

interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
}

export const cloudinaryService = {
  async uploadImage(
    imageBuffer: Buffer | string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      // Default options
      const defaultOptions: UploadOptions = {
        folder: "net-pathway/profiles",
        overwrite: true,
        resource_type: "image", // Use the correct string literal type
      };

      // Merge options
      const uploadOptions: UploadApiOptions = {
        ...defaultOptions,
        ...options,
      };

      // Convert buffer to base64 string if it's a buffer
      let base64Image = imageBuffer;
      if (Buffer.isBuffer(imageBuffer)) {
        base64Image = `data:image/png;base64,${imageBuffer.toString("base64")}`;
      }

      // Upload to Cloudinary
      const result: UploadApiResponse = await cloudinary.uploader.upload(
        base64Image as string,
        uploadOptions
      );

      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  },

  getOptimizedUrl(
    publicId: string,
    width: number = 200,
    height: number = 200
  ): string {
    return cloudinary.url(publicId, {
      width,
      height,
      crop: "fill",
      gravity: "face",
      fetch_format: "auto",
      quality: "auto",
    });
  },

  async deleteImage(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      throw error;
    }
  },
};

export default cloudinaryService;
