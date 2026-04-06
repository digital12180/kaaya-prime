import mongoose, { Document } from "mongoose";
export interface ILandingPage extends Document {
    title: string;
    slug: string;
    content: string;
    formType: "CONTACT" | "CONSULTATION" | "DOWNLOAD" | "NONE";
    status: "PUBLISHED" | "DRAFT" | "DISABLED";
    createdAt: Date;
    updatedAt: Date;
}
export declare const LandingPage: mongoose.Model<ILandingPage, {}, {}, {}, mongoose.Document<unknown, {}, ILandingPage, {}, mongoose.DefaultSchemaOptions> & ILandingPage & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILandingPage>;
//# sourceMappingURL=landingPage.model.d.ts.map