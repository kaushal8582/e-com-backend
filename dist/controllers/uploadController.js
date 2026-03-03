"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = uploadImage;
exports.getCloudinarySignature = getCloudinarySignature;
exports.deleteCloudinaryImage = deleteCloudinaryImage;
const uploadService = __importStar(require("../services/uploadService.js"));
async function uploadImage(req, res) {
    try {
        const file = req.file;
        if (!file?.path) {
            res.status(400).json({ success: false, message: 'No file uploaded' });
            return;
        }
        const result = await uploadService.uploadOnCloudinary(file.path);
        res.json({ success: true, data: { url: result.url, publicId: result.publicId } });
    }
    catch (err) {
        const message = toErrorMessage(err);
        const status = message.includes('not configured') ? 503 : 500;
        res.status(status).json({ success: false, message });
    }
}
function toErrorMessage(err) {
    if (err instanceof Error) {
        const msg = err.message;
        if (typeof msg === 'string' && msg !== '[object Object]')
            return msg;
    }
    if (err && typeof err === 'object') {
        const o = err;
        if (typeof o.message === 'string')
            return o.message;
        if (typeof o.error === 'string')
            return o.error;
        if (o.error && typeof o.error.message === 'string') {
            return o.error.message;
        }
        try {
            const s = JSON.stringify(o);
            if (s !== '{}')
                return s;
        }
        catch {
            // ignore
        }
    }
    return typeof err === 'string' ? err : 'Upload failed';
}
async function getCloudinarySignature(req, res) {
    try {
        const folder = req.query.folder || 'ecommerce';
        const data = uploadService.getCloudinarySignature(folder);
        res.json({ success: true, data });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Upload not configured';
        res.status(503).json({ success: false, message });
    }
}
async function deleteCloudinaryImage(req, res) {
    try {
        await uploadService.deleteCloudinaryImage(req.params.publicId);
        res.json({ success: true, message: 'Image deleted' });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete';
        res.status(400).json({ success: false, message });
    }
}
