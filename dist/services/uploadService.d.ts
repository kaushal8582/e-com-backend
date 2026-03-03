export declare function getCloudinarySignature(folder: string): {
    timestamp: number;
    signature: string;
    apiKey: string;
    cloudName: string;
    folder: string;
};
export declare function deleteCloudinaryImage(publicId: string): Promise<void>;
