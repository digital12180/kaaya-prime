import Property from "./property.model.js";
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
        mainImage?: Buffer | null,
        galleryImages?: Buffer[],
        floorImage?: Buffer | null
    ): Promise<IProperty> {

        try {

            let imageUrl = "";
            let floorPlanUrl = "";

            let images: string[] = [];

            // Main Image Upload

            if (floorImage) {

                floorPlanUrl =
                    await uploadToCloudinary(
                        floorImage,
                        "image",
                        `property-main-${Date.now()}`
                    );
            }

            if (mainImage) {

                imageUrl =
                    await uploadToCloudinary(
                        mainImage,
                        "image",
                        `property-main-${Date.now()}`
                    );
            }


            // Gallery Images Upload

            if (
                galleryImages &&
                galleryImages.length > 0
            ) {

                images = await Promise.all(
                    galleryImages.map(
                        (buffer, index) =>
                            uploadToCloudinary(
                                buffer,
                                "image",
                                `property-gallery-${Date.now()}-${index}`
                            )
                    )
                );
            }

            const slug = slugify(
                createPropertyDto.title,
                {
                    lower: true,
                    strict: true,
                    trim: true
                }
            );

            const property = new Property({
                title: createPropertyDto.title,

                slug,

                price: createPropertyDto.price,

                status: createPropertyDto.status,

                type: createPropertyDto.type,

                location: createPropertyDto.location,

                description:
                    createPropertyDto.description,

                imageUrl,

                images,

                specs:
                    createPropertyDto.specs,

                amenities:
                    createPropertyDto.amenities,

                floorPlanUrl,

                videoUrl:
                    createPropertyDto.videoUrl ?? ""
            });

            return await property.save();

        } catch (error) {

            throw new Error(
                `Error creating property: ${error}`
            );
        }
    }

    /**
     * Get all properties with filters
     */
    /**
  * Get all properties with filters
  */
    async getProperties(filters: {
        status?: string;
        type?: string;
        location?: string;
        minPrice?: string;
        maxPrice?: string;
        bedrooms?: string;
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
                bedrooms,
                search,
                page = 1,
                limit = 10,
            } = filters;

            const query: any = {};

            // Apply filters
            if (status) query.status = status;
            if (type) query.type = type;
            if (location) query.location = { $regex: location, $options: "i" };

            // Price filter (convert string prices to numbers for comparison)
            if (minPrice || maxPrice) {
                query.price = {};

                const parsePrice = (priceStr: string) => {
                    const cleaned = priceStr.replace(/[^0-9.]/g, '');
                    return parseFloat(cleaned);
                };

                if (minPrice) {
                    const min = parsePrice(minPrice);
                    if (!isNaN(min)) query.price.$gte = min;
                }
                if (maxPrice) {
                    const max = parsePrice(maxPrice);
                    if (!isNaN(max)) query.price.$lte = max;
                }
            }

            // Bedrooms filter
            if (bedrooms) {
                if (bedrooms === "4+") {
                    // For 4+ bedrooms, find properties with 4 or more bedrooms
                    query["specs.value"] = { $gte: "4" };
                } else {
                    // For specific bedroom count
                    query["specs.value"] = bedrooms;
                }
                // Add condition to only match bedroom specs
                query["specs.label"] = "Bedrooms";
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
            let updatedImages = property.images || [];
            if (imageBuffers && imageBuffers.length > 0) {
                const uploadPromises = imageBuffers.map((buffer, index) =>
                    uploadToCloudinary(buffer, "image", `property-${Date.now()}-${index}`)
                );
                const newImages = await Promise.all(uploadPromises);
                updatedImages = [...updatedImages, ...newImages];
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

            // If imageUrl is being updated, add it to images array
            if (updatePropertyDto.imageUrl && !updatedImages.includes(updatePropertyDto.imageUrl)) {
                updatedImages = [updatePropertyDto.imageUrl, ...updatedImages];
            }

            updateData.images = updatedImages;

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

            // If the main imageUrl is being removed, update it to the first remaining image
            let updateData: any = { images: updatedImages };
            if (imageUrlsToRemove.includes(property.imageUrl) && updatedImages.length > 0) {
                updateData.imageUrl = updatedImages[0];
            } else if (imageUrlsToRemove.includes(property.imageUrl) && updatedImages.length === 0) {
                updateData.imageUrl = "";
            }

            return await Property.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error removing images: ${error}`);
        }
    }
}