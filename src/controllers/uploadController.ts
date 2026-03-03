import { Request, Response } from 'express';
import * as uploadService from '../services/uploadService.js';

export async function uploadImage(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;
    if (!file?.path) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }
    const result = await uploadService.uploadOnCloudinary(file.path);
    res.json({ success: true, data: { url: result.url, publicId: result.publicId } });
  } catch (err) {
    const message = toErrorMessage(err);
    const status = message.includes('not configured') ? 503 : 500;
    res.status(status).json({ success: false, message });
  }
}

function toErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message;
    if (typeof msg === 'string' && msg !== '[object Object]') return msg;
  }
  if (err && typeof err === 'object') {
    const o = err as Record<string, unknown>;
    if (typeof o.message === 'string') return o.message;
    if (typeof o.error === 'string') return o.error;
    if (o.error && typeof (o.error as Record<string, unknown>).message === 'string') {
      return (o.error as { message: string }).message;
    }
    try {
      const s = JSON.stringify(o);
      if (s !== '{}') return s;
    } catch {
      // ignore
    }
  }
  return typeof err === 'string' ? err : 'Upload failed';
}

export async function getCloudinarySignature(
  req: { query: { folder?: string } },
  res: Response
): Promise<void> {
  try {
    const folder = req.query.folder || 'ecommerce';
    const data = uploadService.getCloudinarySignature(folder);
    res.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload not configured';
    res.status(503).json({ success: false, message });
  }
}

export async function deleteCloudinaryImage(
  req: { params: { publicId: string } },
  res: Response
): Promise<void> {
  try {
    await uploadService.deleteCloudinaryImage(req.params.publicId);
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete';
    res.status(400).json({ success: false, message });
  }
}
