import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});
type ResourceType = "image" | "raw" | "video";

export default cloudinary;
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  resourceType: ResourceType = "image",
  fileName?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: resourceType,
          folder: "kaaya",
          public_id: fileName as string, // ✅ IMPORTANT
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || "");
        }
      )
      .end(fileBuffer);
  });
};

//for pdf fix-report -pdf image-upload
// export const uploadToCloudinary = (
//   fileBuffer: Buffer,
//   mimetype?: string
// ): Promise<string> => {
//   return new Promise((resolve, reject) => {

//     let options: any = {
//       folder: "kaaya",
//     };

//     // ✅ IMAGE
//     if (mimetype?.startsWith("image/")) {
//       options.resource_type = "image";
//     }

//     // ✅ PDF
//     else if (mimetype === "application/pdf") {
//       options.resource_type = "raw";
//       options.format = "pdf"; // only for PDF
//     }

//     else {
//       return reject(new Error("Unsupported file type"));
//     }

//     cloudinary.uploader.upload_stream(
//       options,
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result?.secure_url || "");
//       }
//     ).end(fileBuffer);

//   });
// };