"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCloudinarySignature = getCloudinarySignature;
exports.deleteCloudinaryImage = deleteCloudinaryImage;
const cloudinary_1 = require("cloudinary");
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
if (cloudName && apiKey && apiSecret) {
    cloudinary_1.v2.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
}
function getCloudinarySignature(folder) {
    if (!apiSecret || !apiKey || !cloudName) {
        throw new Error('Cloudinary is not configured');
    }
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = { folder, timestamp };
    const signature = cloudinary_1.v2.utils.api_sign_request(paramsToSign, apiSecret);
    return { timestamp, signature, apiKey, cloudName, folder };
}
async function deleteCloudinaryImage(publicId) {
    if (!apiSecret || !cloudName) {
        throw new Error('Cloudinary is not configured');
    }
    await cloudinary_1.v2.uploader.destroy(publicId);
}
