import type { Request, Response } from 'express';
import { PropertyService } from './property.service.js';
import type { ICreatePropertyDto, IUpdatePropertyDto, IQueryPropertyDto } from './property.dto.js';

const propertyService = new PropertyService();

export class PropertyController {
    // Create a new property
    async create(req: Request, res: Response) {
        try {
            // Parse the body if it's a string (for multipart form data)
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

            // Validate required fields
            const requiredFields = ['title', 'price', 'priceUnit', 'listingType', 'address', 'description', 'specs', 'amenities', 'images', 'floorPlan', 'agent', 'neighborhoodInsights', 'highlights'];
            const missingFields = requiredFields.filter(field => !body[field]);

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`,
                });
            }

            const property = await propertyService.createProperty(body as ICreatePropertyDto);

            res.status(201).json({
                success: true,
                data: property,
            });
        } catch (error) {
            console.error('Create property error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create property',
                error: error instanceof Error ? error.message : 'Unknown error',
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