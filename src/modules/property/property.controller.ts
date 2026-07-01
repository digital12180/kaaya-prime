import type { Request, Response } from 'express';
import { PropertyService } from './property.service.js';
import type { ICreatePropertyDto, IUpdatePropertyDto, IQueryPropertyDto } from './property.dto.js';
import { uploadToCloudinary } from '../../config/cloudinary.js';

const propertyService = new PropertyService();

export class PropertyController {
    // Create a new property
    async create(req: Request, res: Response) {
        try {

            const body =
                typeof req.body.data === "string"
                    ? JSON.parse(req.body.data)
                    : req.body;

            const files = req.files as {
                images?: Express.Multer.File[];
                floorPlan?: Express.Multer.File[];
                videoTour?: Express.Multer.File[];
            };

            // Upload Images
            let imageUrls: string[] = [];

            if (files?.images?.length) {
                imageUrls = await Promise.all(
                    files.images.map(file =>
                        uploadToCloudinary(file.buffer, "image")
                    )
                );
            }

            // Upload Floor Plan
            const floorPlanFile = files?.floorPlan?.[0];

            if (floorPlanFile) {
                const url = await uploadToCloudinary(
                    floorPlanFile.buffer,
                    "image"
                );

                body.floorPlan = {
                    ...(body.floorPlan || {}),
                    url,
                };
            }

            const videoFile = files?.videoTour?.[0];

            if (videoFile) {
                body.videoTourUrl = await uploadToCloudinary(
                    videoFile.buffer,
                    "video"
                );
            }

            body.images = imageUrls;

            // body.floorPlan = {
            //     ...body.floorPlan,
            //     url: floorPlanUrl,
            // };

            // if (videoUrl) {
            //     body.videoTourUrl = videoUrl;
            // }

            const property = await propertyService.createProperty(body);

            return res.status(201).json({
                success: true,
                data: property,
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Failed to create property",
            });

        }
    }

    // Get all properties with filters and pagination
    async getAll(req: Request, res: Response) {
        try {
            const queryDto: IQueryPropertyDto | any = {
                search: req.query.search as string,
                listingType: req.query.listingType as 'rent' | 'sale',
                status: req.query.status as 'Active' | 'Pending' | 'Sold' | 'Rented',
                city: req.query.city as string,
                area: req.query.area as string,
                minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
                maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
                bedrooms: req.query.bedrooms ? Number(req.query.bedrooms) : undefined,
                bathrooms: req.query.bathrooms ? Number(req.query.bathrooms) : undefined,
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                sortBy: req.query.sortBy as string,
                sortOrder: req.query.sortOrder as 'asc' | 'desc',
            };

            const result = await propertyService.getProperties(queryDto);

            res.status(200).json({
                success: true,
                data: result.properties,
                pagination: {
                    total: result.total,
                    page: result.page,
                    totalPages: result.totalPages,
                    limit: queryDto.limit || 10,
                },
            });
        } catch (error) {
            console.error('Get properties error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch properties',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    // Get a single property by ID
    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const property = await propertyService.getPropertyById(id as string);

            if (!property) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found',
                });
            }

            res.status(200).json({
                success: true,
                data: property,
            });
        } catch (error) {
            console.error('Get property error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch property',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    // Update a property
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            const files = req.files as {
                images?: Express.Multer.File[];
                floorPlan?: Express.Multer.File[];
                videoTour?: Express.Multer.File[];
            };

            if (files?.images?.length) {
                body.images = await Promise.all(
                    files.images.map(file =>
                        uploadToCloudinary(file.buffer, "image")
                    )
                );
            }
            const floorPlanFile = files?.floorPlan?.[0];

            if (floorPlanFile) {
                const url = await uploadToCloudinary(
                    floorPlanFile.buffer,
                    "image"
                );

                body.floorPlan = {
                    ...(body.floorPlan || {}),
                    url,
                };
            }

            const videoFile = files?.videoTour?.[0];

            if (videoFile) {
                body.videoTourUrl = await uploadToCloudinary(
                    videoFile.buffer,
                    "video"
                );
            }
            const property = await propertyService.updateProperty(id as string, body as IUpdatePropertyDto);

            if (!property) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found',
                });
            }

            res.status(200).json({
                success: true,
                data: property,
            });
        } catch (error) {
            console.error('Update property error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update property',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    // Delete a property
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const property = await propertyService.deleteProperty(id as string);

            if (!property) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Property deleted successfully',
                data: property,
            });
        } catch (error) {
            console.error('Delete property error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete property',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}