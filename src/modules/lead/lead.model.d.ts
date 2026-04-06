import mongoose, { Document } from "mongoose";
export interface ILead extends Document {
    name: string;
    email: string;
    phone: string;
    message?: string;
    source?: string;
    page?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Lead: mongoose.Model<ILead, {}, {}, {}, mongoose.Document<unknown, {}, ILead, {}, mongoose.DefaultSchemaOptions> & ILead & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILead>;
//# sourceMappingURL=lead.model.d.ts.map