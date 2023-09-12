import { diskStorage } from 'multer';
import { Request } from 'express';
import * as path from 'path';

const MIME_TYPES: Record<string, string> = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage = diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
    callback(null, './images');
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
  ) => {
    if (!file.originalname || file.originalname.trim() === '') {
      callback(new Error('Invalid file name'), '');
      return;
    }

    const name: string = path.parse(file.originalname).name;
    const extension: string = MIME_TYPES[file.mimetype];

    if (!extension) {
      callback(new Error('Format invalide'), '');
      return;
    }
    callback(null, name + '_' + Date.now() + '.' + extension);
  },
});

export const MulterConfig = {
  storage: storage,
};
