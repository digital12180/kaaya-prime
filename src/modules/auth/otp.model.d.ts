import mongoose, { Document } from "mongoose";
export interface IOtp extends Document {
    email: string;
    otp: string;
    expiresAt: Date;
}
export declare const OtpModel: mongoose.Model<IOtp, {}, {}, {}, mongoose.Document<unknown, {}, IOtp, {}, mongoose.DefaultSchemaOptions> & IOtp & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOtp>;
//# sourceMappingURL=otp.model.d.ts.map