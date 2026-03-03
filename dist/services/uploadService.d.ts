export declare function uploadOnCloudinary(localFilePath: string): Promise<{
    url: string;
    publicId: string;
}>;
export declare function getCloudinarySignature(folder: string): {
    timestamp: number;
    signature: string;
    apiKey: string;
    cloudName: string;
    folder: string;
};
export declare function deleteCloudinaryImage(publicId: string): Promise<void>;
