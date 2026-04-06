import mongoose, { Document, Schema } from "mongoose";
const OpportunitySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true, // 🔥 search optimization
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
        index: true, // 🔥 filter by city/location
    },
    image: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["ACTIVE", "UPCOMING", "SOLD OUT", "UNDER REVIEW"],
        default: "ACTIVE",
        index: true, // 🔥 filtering
    },
}, {
    timestamps: true, // createdAt + updatedAt
});
// 🔥 TEXT INDEX (for search)
OpportunitySchema.index({
    title: "text",
    description: "text",
    location: "text",
});
// 🔥 COMPOUND INDEX (for listing + filters)
OpportunitySchema.index({ status: 1, location: 1, createdAt: -1 });
export const Opportunity = mongoose.model("Opportunity", OpportunitySchema);
//# sourceMappingURL=opportunity.model.js.map