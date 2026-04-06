import mongoose, { Document } from "mongoose";
export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    image?: string;
    metaTitle?: string;
    metaDescription?: string;
    status: "PUBLISHED" | "DRAFT";
    createdAt: Date;
    updatedAt: Date;
}
export declare const Blog: mongoose.Model<IBlog, {}, {}, {}, mongoose.Document<unknown, {}, IBlog, {}, mongoose.DefaultSchemaOptions> & IBlog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBlog>;
//# sourceMappingURL=blog.model.d.ts.map