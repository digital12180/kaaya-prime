import mongoose, { Document } from "mongoose";
export interface IReport extends Document {
    title: string;
    description: string;
    fileUrl: string;
    image?: string;
    status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
    createdAt: Date;
    updatedAt: Date;
}
export declare const Report: mongoose.Model<IReport, {}, {}, {}, mongoose.Document<unknown, {}, IReport, {}, mongoose.DefaultSchemaOptions> & IReport & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IReport>;
//# sourceMappingURL=report.model.d.ts.map