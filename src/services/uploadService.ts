import { v2 as cloudinaryV2 } from 'cloudinary';
import fs from 'fs';

function getConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  return { cloudName, apiKey, apiSecret };
}

function ensureConfig() {
  const { cloudName, apiKey, apiSecret } = getConfig();
  if (cloudName && apiKey && apiSecret) {
    cloudinaryV2.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  }
}

export async function uploadOnCloudinary(
  localFilePath: string
): Promise<{ url: string; publicId: string }> {
  if (!localFilePath) {
    throw new Error('No file path provided');
  }
  const { cloudName, apiKey, apiSecret } = getConfig();
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env'
    );
  }
  ensureConfig();
  try {
    const ext = localFilePath.split('.').pop()?.toLowerCase() ?? '';
    const resourceType = ext === 'pdf' ? 'raw' : 'auto';
    const result = await cloudinaryV2.uploader.upload(localFilePath, {
      resource_type: resourceType,
      folder: 'ecommerce',
    });
    try {
      fs.unlinkSync(localFilePath);
    } catch {
      // ignore cleanup errors
    }
    if (!result?.secure_url || !result?.public_id) {
      throw new Error('Cloudinary returned invalid response');
    }
    return { url: result.secure_url, publicId: result.public_id };
  } catch (err) {
    try {
      fs.unlinkSync(localFilePath);
    } catch {
      // ignore
    }
    const message = toErrorMessage(err);
    console.error('Cloudinary upload error:', message);
    throw new Error(message);
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

export function getCloudinarySignature(folder: string): {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
} {
  const { cloudName, apiKey, apiSecret } = getConfig();
  if (!apiSecret || !apiKey || !cloudName) {
    throw new Error('Cloudinary is not configured');
  }
  ensureConfig();
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { folder, timestamp };
  const signature = cloudinaryV2.utils.api_sign_request(paramsToSign, apiSecret);
  return { timestamp, signature, apiKey, cloudName, folder };
}

export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  const { cloudName, apiSecret } = getConfig();
  if (!apiSecret || !cloudName) {
    throw new Error('Cloudinary is not configured');
  }
  ensureConfig();
  await cloudinaryV2.uploader.destroy(publicId);
}
