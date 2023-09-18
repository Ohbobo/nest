import { diskStorage } from 'multer';
import { Request } from 'express';

const MIME_TYPES: Record<string, string> = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage = diskStorage({
  destination: './images',
  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
) => {
    if (!file.originalname || file.originalname.trim() === '') {
        callback(new Error('Invalid file name'), '');
        return;
    }

    const name: string = file.originalname.split(' ').join('_');
    const extension: string = MIME_TYPES[file.mimetype];

    if (!extension) {
        callback(new Error('Format invalide'), '');
        return;
    }

    callback(null, `${Date.now()}_${name}`);
},

});

export const MulterConfig = {
  storage: storage,
};
