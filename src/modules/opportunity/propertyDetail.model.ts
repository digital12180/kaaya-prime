import mongoose, { Document, Schema } from "mongoose";

export interface IPropertyDetails extends Document {
    id: string;
    title: string;
    price: string;
    status: string;
    address: string;
    description: string;
    specs: {
        label: string;
        value: string;
        icon: string;
    }[];
    amenities: string[];
    images: string[];
    floorPlanUrl: string;
}

const PropertyDetailSchema = new Schema<IPropertyDetails>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["Available", "Sold", "Pending", "Rented"],
        },
        address: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        specs: [
            {
                label: {
                    type: String,
                    required: true,
                },
                value: {
                    type: String,
                    required: true,
                },
                icon: {
                    type: String,
                    required: true,
                },
            },
        ],
        amenities: [
            {
                type: String,
            },
        ],
        images: [
            {
                type: String,
            },
        ],
        floorPlanUrl: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const PropertyDetailModel = mongoose.model<IPropertyDetails>(
    "PropertyDetail",
    PropertyDetailSchema
);