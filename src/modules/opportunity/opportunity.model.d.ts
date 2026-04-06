import mongoose, { Document } from "mongoose";
export interface IOpportunity extends Document {
    title: string;
    description: string;
    location: string;
    image: string;
    status: "ACTIVE" | "UPCOMING" | "SOLD OUT" | "UNDER REVIEW";
    createdAt: Date;
    updatedAt: Date;
}
export declare const Opportunity: mongoose.Model<IOpportunity, {}, {}, {}, mongoose.Document<unknown, {}, IOpportunity, {}, mongoose.DefaultSchemaOptions> & IOpportunity & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOpportunity>;
//# sourceMappingURL=opportunity.model.d.ts.map