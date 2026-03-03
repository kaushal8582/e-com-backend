import multer from 'multer';
import path from 'path';
import fs from 'fs';

const tempDir = path.join(process.cwd(), 'public', 'temp');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, tempDir);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname) || '';
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').slice(0, 80);
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `${base}-${unique}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter(_req, file, cb) {
    const allowed = /\.(jpe?g|png|gif|webp|pdf)$/i.test(file.originalname);
    if (allowed) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpg, png, gif, webp) and PDF are allowed'));
    }
  },
});
