export declare function getRazorpayKeyId(): string | undefined;
export declare function isRazorpayConfigured(): boolean;
export declare function createRazorpayOrder(amountInRupees: number, receipt: string, currency?: string): Promise<{
    id: string;
    amount: number;
    currency: string;
}>;
export declare function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean;
