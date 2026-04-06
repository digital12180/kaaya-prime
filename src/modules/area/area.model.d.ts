import mongoose, { Document } from "mongoose";
export interface IArea extends Document {
    name: string;
    slug: string;
    description: string;
    image?: string;
    metaTitle?: string;
    metaDescription?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Area: mongoose.Model<IArea, {}, {}, {}, mongoose.Document<unknown, {}, IArea, {}, mongoose.DefaultSchemaOptions> & IArea & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IArea>;
//# sourceMappingURL=area.model.d.ts.map