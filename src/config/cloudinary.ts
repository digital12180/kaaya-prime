// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";

// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
// });
// type ResourceType = "image" | "raw" | "video"|"auto";

// export default cloudinary;
// export const uploadToCloudinary = (
//   fileBuffer: Buffer,
//   resourceType: ResourceType = "image",
//   fileName?: string
// ): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         {
//           resource_type: resourceType,
//           folder: "kaaya",
//           public_id: fileName as string, // ✅ IMPORTANT
//         },
//         (error, result) => {
//           if (error) return reject(error);
//           resolve(result?.secure_url || "");
//         }
//       )
//       .end(fileBuffer);
//   });
// };

// //for pdf fix-report -pdf image-upload
// // export const uploadToCloudinary = (
// //   fileBuffer: Buffer,
// //   mimetype?: string
// // ): Promise<string> => {
// //   return new Promise((resolve, reject) => {

// //     let options: any = {
// //       folder: "kaaya",
// //     };

// //     // ✅ IMAGE
// //     if (mimetype?.startsWith("image/")) {
// //       options.resource_type = "image";
// //     }

// //     // ✅ PDF
// //     else if (mimetype === "application/pdf") {
// //       options.resource_type = "raw";
// //       options.format = "pdf"; // only for PDF
// //     }

// //     else {
// //       return reject(new Error("Unsupported file type"));
// //     }

// //     cloudinary.uploader.upload_stream(
// //       options,
// //       (error, result) => {
// //         if (error) return reject(error);
// //         resolve(result?.secure_url || "");
// //       }
// //     ).end(fileBuffer);

// //   });
// // };

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { Readable } from "stream";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

type ResourceType = "image" | "raw" | "video" | "auto";

export default cloudinary;

// export const uploadToCloudinary = (
//   fileBuffer: Buffer | string,
//   resourceType: ResourceType = "image",
//   fileName?: string
// ): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     // If fileBuffer is a string (URL), upload from URL
//     if (typeof fileBuffer === "string") {
//       cloudinary.uploader.upload(
//         fileBuffer,
//         {
//           resource_type: resourceType as "image" | "video" | "raw" | "auto",
//           folder: "properties",
//           ...(fileName ? { public_id: fileName } : {}),
//         },
//         (error, result) => {
//           if (error) return reject(error);
//           resolve(result?.secure_url || "");
//         }
//       );
//       return;
//     }

//     // Upload from buffer
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: resourceType as "image" | "raw" | "video" | "auto",
//         folder: "properties",
//         ...(fileName && { public_id: fileName }),
//         allowed_formats: ["jpg", "png", "gif", "webp", "jpeg"],
//       },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result?.secure_url || "");
//       }
//     );

//     // Create readable stream from buffer
//     const readableStream = new Readable();
//     readableStream.push(fileBuffer);
//     readableStream.push(null);
//     readableStream.pipe(uploadStream);
//   });
// };

// // Delete image from Cloudinary
// export const deleteFromCloudinary = (publicId: string): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.destroy(publicId, (error, result) => {
//       if (error) return reject(error);
//       resolve();
//     });
//   });
// };

// // Extract public ID from Cloudinary URL
// export const getPublicIdFromUrl = (url: string): string => {
//   const parts = url.split("/");
//   const filename = parts[parts.length - 1];
//   const publicId = (filename || "").split(".")[0] ?? "";
//   return `properties/${publicId}`;
// };

export const uploadToCloudinary = (
  fileBuffer: Buffer | string,
  resourceType: ResourceType = "image",
  fileName?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {

    const options: any = {
      resource_type: resourceType,
      folder: "properties",
      ...(fileName && { public_id: fileName }),
    };

    // Only restrict formats for images
    if (resourceType === "image") {
      options.allowed_formats = ["jpg", "jpeg", "png", "gif", "webp"];
    }

    // Only restrict formats for pdf
    if (resourceType === "raw") {
      options.allowed_formats = ["pdf"];
    }

    // Upload from URL
    if (typeof fileBuffer === "string") {
      cloudinary.uploader.upload(
        fileBuffer,
        options,
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || "");
        }
      );
      return;
    }

    // Upload from Buffer
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || "");
      }
    );

    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};