import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {

  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and PDF files are allowed."));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter,
});

// import multer from "multer";
// import path from "path";

// // Configure multer for memory storage
// const storage = multer.memoryStorage();

// // File filter for images
// const fileFilter = (
//   req: any,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   const allowedTypes = /jpeg|jpg|png|gif|webp/;
//   const extname = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase()
//   );
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed"));
//   }
// };

// export const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
//   fileFilter: fileFilter,
// });

// import multer from "multer";

// const storage = multer.memoryStorage();

// const fileFilter = (
//   req: any,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   if (
//     file.mimetype.startsWith("image/") ||
//     file.mimetype === "application/pdf"
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image and pdf files are allowed"));
//   }
// };

// export const upload = multer({
//   storage,
//   limits: {
//     fileSize: 20 * 1024 * 1024,
//   },
//   fileFilter,
// });