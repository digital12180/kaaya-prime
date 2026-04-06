declare class EmailService {
    private transporter;
    constructor();
    verifyConnection(): Promise<void>;
    sendEmail(to: string, subject: string, html: string): Promise<boolean>;
    sendNewMessage(email: string, name: string, senderName: string): Promise<boolean>;
    sendOtpEmail(email: string, otp: string, name?: string): Promise<boolean>;
    sendPasswordResetEmail(email: string, name: string): Promise<boolean>;
}
export declare const emailService: EmailService;
export {};
//# sourceMappingURL=email.service.d.ts.map