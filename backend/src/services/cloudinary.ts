import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Configure Cloudinary with credentials from .env
// This runs once when the module is first imported.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploads a file buffer to Cloudinary.
// Returns the full upload result including URL, public_id, dimensions, etc.
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = "ceylonprive/gallery",
  resourceType: "image" | "video" = "image",
): Promise<{
  public_id: string;
  secure_url: string;
  thumbnail_url?: string;
  width: number;
  height: number;
  format: string;
}> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        // Auto-generate thumbnail for videos
        eager:
          resourceType === "video"
            ? [{ width: 400, height: 300, crop: "fill", format: "jpg" }]
            : undefined,
        // Optimize images automatically
        transformation:
          resourceType === "image"
            ? [{ quality: "auto", fetch_format: "auto" }]
            : undefined,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
          return;
        }
        if (!result) {
          reject(new Error("No result from Cloudinary"));
          return;
        }
        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          thumbnail_url: result.eager?.[0]?.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      },
    );

    // Convert Buffer to a readable stream and pipe to Cloudinary
    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null); // Signals end of stream
    readableStream.pipe(uploadStream);
  });
};

// Deletes a file from Cloudinary by its public_id.
// Called when the guide deletes a gallery item from the dashboard.
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" = "image",
): Promise<void> => {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};
