import { Property } from "./property.model.js";
import type { IProperty } from "./property.model.js";
import { CreatePropertyDto } from "./opportunity.dto.js";
import { UpdatePropertyDto } from "./opportunity.dto.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";
import slugify from "slugify";
import mongoose, { Types } from "mongoose";

export class PropertyService {
    /**
     * Create a new property
     */
    async createProperty(
        createPropertyDto: CreatePropertyDto,
        imageBuffers?: Buffer[]
    ): Promise<IProperty> {
        try {
            // Upload images to Cloudinary if provided
            let imageUrls: string[] = [];
            if (imageBuffers && imageBuffers.length > 0) {
                const uploadPromises = imageBuffers.map((buffer, index) =>
                    uploadToCloudinary(buffer, "image", `property-${Date.now()}-${index}`)
                );
                imageUrls = await Promise.all(uploadPromises);
            }

            // Generate slug from title
            const slug = slugify(createPropertyDto.title, {
                lower: true,
                strict: true,
                trim: true,
            });

            const propertyData = {
                ...createPropertyDto,
                slug,
                images: imageUrls,
            };

            const property = new Property(propertyData);
            return await property.save();
        } catch (error) {
            throw new Error(`Error creating property: ${error}`);
        }
    }

    /**
     * Get all properties with filters
     */
    async getProperties(filters: {
        status?: string;
        type?: string;
        location?: string;
        minPrice?: number;
        maxPrice?: number;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{ properties: IProperty[]; total: number }> {
        try {
            const {
                status,
                type,
                location,
                minPrice,
                maxPrice,
                search,
                page = 1,
                limit = 10,
            } = filters;

            const query: any = {};

            if (status) query.status = status;
            if (type) query.type = type;
            if (location) query.location = { $regex: location, $options: "i" };

            // Price filter
            if (minPrice !== undefined || maxPrice !== undefined) {
                query.price = {};
                if (minPrice !== undefined) query.price.$gte = minPrice;
                if (maxPrice !== undefined) query.price.$lte = maxPrice;
            }

            // Text search
            if (search) {
                query.$text = { $search: search };
            }

            const skip = (page - 1) * limit;

            const [properties, total] = await Promise.all([
                Property.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                Property.countDocuments(query),
            ]);

            return { properties, total };
        } catch (error) {
            throw new Error(`Error fetching properties: ${error}`);
        }
    }

    /**
     * Get a single property by ID
     */
    async getPropertyById(id: string): Promise<IProperty | null> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error("Invalid property ID");
            }
            return await Property.findById(id);
        } catch (error) {
            throw new Error(`Error fetching property: ${error}`);
        }
    }

    /**
     * Get a single property by slug
     */
    async getPropertyBySlug(slug: string): Promise<IProperty | null> {
        try {
            return await Property.findOne({ slug });
        } catch (error) {
            throw new Error(`Error fetching property: ${error}`);
        }
    }

    /**
     * Update a property
     */
    async updateProperty(
        id: string,
        updatePropertyDto: UpdatePropertyDto,
        imageBuffers?: Buffer[]
    ): Promise<IProperty | null> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error("Invalid property ID");
            }

            const property = await Property.findById(id);
            if (!property) {
                throw new Error("Property not found");
            }

            // Upload new images if provided
            let imageUrls = property.images || [];
            if (imageBuffers && imageBuffers.length > 0) {
                const uploadPromises = imageBuffers.map((buffer, index) =>
                    uploadToCloudinary(buffer, "image", `property-${Date.now()}-${index}`)
                );
                const newImages = await Promise.all(uploadPromises);
                imageUrls = [...imageUrls, ...newImages];
            }

            // Update slug if title changed
            let updateData: any = { ...updatePropertyDto };
            if (updatePropertyDto.title) {
                updateData.slug = slugify(updatePropertyDto.title, {
                    lower: true,
                    strict: true,
                    trim: true,
                });
            }

            updateData.images = imageUrls;

            return await Property.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            );
        } catch (error) {
            throw new Error(`Error updating property: ${error}`);
        }
    }

    /**
     * Delete a property
     */
    async deleteProperty(id: string): Promise<IProperty | null> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error("Invalid property ID");
            }
            return await Property.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error deleting property: ${error}`);
        }
    }

    /**
     * Remove specific images from a property
     */
    async removeImages(id: string, imageUrlsToRemove: string[]): Promise<IProperty | null> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error("Invalid property ID");
            }

            const property = await Property.findById(id);
            if (!property) {
                throw new Error("Property not found");
            }

            // Filter out images to remove
            const updatedImages = property.images.filter(
                (img) => !imageUrlsToRemove.includes(img)
            );

            return await Property.findByIdAndUpdate(
                id,
                { $set: { images: updatedImages } },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error removing images: ${error}`);
        }
    }
}