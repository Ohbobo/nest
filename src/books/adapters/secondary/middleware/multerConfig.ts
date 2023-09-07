import { diskStorage } from 'multer';
import { Request } from 'express';
import path = require('path');

const MIME_TYPES: Record<string, string> = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage = diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ) => {
    callback(null, 'images');
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
  ) => {
    const name: string = file.originalname.split(' ').join('_');
    const extension: string | undefined = MIME_TYPES[file.mimetype];

    if (!extension) {
      callback(new Error('Invalid file type'), '');
      return;
    }

    callback(null, name + Date.now() + '.' + extension);
  },
});

export const multerConfig = {
  storage: storage,
};
