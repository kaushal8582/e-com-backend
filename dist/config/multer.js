"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const tempDir = path_1.default.join(process.cwd(), 'public', 'temp');
if (!fs_1.default.existsSync(tempDir)) {
    fs_1.default.mkdirSync(tempDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination(_req, _file, cb) {
        cb(null, tempDir);
    },
    filename(_req, file, cb) {
        const ext = path_1.default.extname(file.originalname) || '';
        const base = path_1.default.basename(file.originalname, ext).replace(/\s+/g, '-').slice(0, 80);
        const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        cb(null, `${base}-${unique}${ext}`);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter(_req, file, cb) {
        const allowed = /\.(jpe?g|png|gif|webp|pdf)$/i.test(file.originalname);
        if (allowed) {
            cb(null, true);
        }
        else {
            cb(new Error('Only images (jpg, png, gif, webp) and PDF are allowed'));
        }
    },
});
