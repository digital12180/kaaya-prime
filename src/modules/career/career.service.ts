import { Career } from "./career.model.js";
import type { ICareer, ICareerDocument } from "./career.model.js";
import type { CreateCareerDTO, UpdateCareerDTO, CareerQueryParams, PaginatedResponse } from "./career.dto.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../config/cloudinary.js";
import mongoose from "mongoose";

export class CareerService {
    // Create career with CV upload
    async createCareer(data: CreateCareerDTO, file?: Express.Multer.File): Promise<ICareerDocument> {
        let cvData = data.cv || { url: "", public_id: "", altText: "" };

        // Upload file to Cloudinary if provided
        if (file) {
            const resourceType = file.mimetype === "application/pdf" ? "raw" : "image";
            const fileName = `cv_${Date.now()}_${file.originalname.split(".")[0]}`;

            const uploadResult = await uploadToCloudinary(
                file.buffer,
                resourceType as any,
                fileName
            );

            cvData = {
                url: uploadResult,
                public_id: fileName, // or ""
                altText: file.originalname,
            };
        }

        const career = new Career({
            ...data,
            cv: cvData,
        });

        return await career.save();
    }

    // Get all careers with pagination and filters
    async getCareers(params: CareerQueryParams): Promise<PaginatedResponse<ICareerDocument>> {
        const page = Math.max(1, params.page || 1);
        const limit = Math.min(100, Math.max(1, params.limit || 10));
        const skip = (page - 1) * limit;

        const filter: any = {};

        // Filter by fullName (case-insensitive)
        if (params.fullName) {
            filter.fullName = { $regex: params.fullName, $options: "i" };
        }

        // Filter by location (case-insensitive)
        if (params.location) {
            filter.location = { $regex: params.location, $options: "i" };
        }

        // Text search on fullName
        if (params.search) {
            filter.$text = { $search: params.search };
        }

        const [data, total] = await Promise.all([
            Career.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Career.countDocuments(filter),
        ]);

        return {
            data: data as ICareerDocument[],
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    // Get single career by ID
    async getCareerById(id: string): Promise<ICareerDocument | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }
        return await Career.findById(id).lean();
    }

    // Update career
    async updateCareer(
        id: string,
        data: UpdateCareerDTO,
        file?: Express.Multer.File
    ): Promise<ICareerDocument | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }

        const existingCareer = await Career.findById(id);
        if (!existingCareer) {
            return null;
        }

        let cvData = data.cv;

        // If new file is uploaded, handle Cloudinary upload and deletion
        if (file) {
            // Delete old file from Cloudinary if exists
            if (existingCareer.cv?.public_id) {
                await deleteFromCloudinary(existingCareer.cv.public_id);
            }

            const resourceType = file.mimetype === "application/pdf" ? "raw" : "image";
            const fileName = `cv_${Date.now()}_${file.originalname.split(".")[0]}`;

            const uploadResult = await uploadToCloudinary(
                file.buffer,
                resourceType as any,
                fileName
            );

            cvData = {
                url: uploadResult,
                public_id: fileName, // or ""
                altText: file.originalname,
            };

        }

        const updateData = {
            ...data,
            ...(cvData && { cv: cvData }),
        };

        return await Career.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).lean();
    }

    // Delete career
    async deleteCareer(id: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }

        const career = await Career.findById(id);
        if (!career) {
            return false;
        }

        // Delete CV from Cloudinary if exists
        if (career.cv?.public_id) {
            await deleteFromCloudinary(career.cv.public_id);
        }

        await Career.findByIdAndDelete(id);
        return true;
    }
}