import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

// Allowed file types
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
// Directory to save uploaded files
const uploadDir = path.join(__dirname, "../../public");

// Storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter to allow only images
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg, png, and webp images are allowed"));
  }
};

// Multer config
export const uploadSingleImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
}).single("image"); // name of the field in the form
