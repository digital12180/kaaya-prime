import type { Request, Response } from "express";
import { PropertyService } from "./opportunity.service.js";
import { CreatePropertyDto } from "./opportunity.dto.js";
import { UpdatePropertyDto } from "./opportunity.dto.js";
import { PropertyResponseDto } from "./opportunity.dto.js";


const propertyService = new PropertyService();

export class PropertyController {
  /**
   * Create a new property
   */
  async createProperty(req: Request, res: Response): Promise<void> {
    try {
      const createPropertyDto: CreatePropertyDto = req.body;
      
      // Handle file uploads (multer should be configured)
      const files = req.files as Express.Multer.File[];
      const imageBuffers = files?.map((file) => file.buffer) || [];

      const property = await propertyService.createProperty(
        createPropertyDto,
        imageBuffers
      );

      res.status(201).json({
        success: true,
        message: "Property created successfully",
        data: PropertyResponseDto.fromDocument(property),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to create property",
      });
    }
  }

  /**
   * Get all properties
   */
  async getProperties(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        status: req.query.status as string,
        type: req.query.type as string,
        location: req.query.location as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        search: req.query.search as string,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
      };

      const { properties, total } = await propertyService.getProperties(filters as any);

      res.status(200).json({
        success: true,
        data: PropertyResponseDto.fromDocuments(properties),
        pagination: {
          total,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.ceil(total / (filters.limit || 10)),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch properties",
      });
    }
  }

  /**
   * Get a single property by ID
   */
  async getPropertyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const property = await propertyService.getPropertyById(id as string);

      if (!property) {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: PropertyResponseDto.fromDocument(property),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch property",
      });
    }
  }

  /**
   * Get property by slug
   */
  async getPropertyBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const property = await propertyService.getPropertyBySlug(slug as string);

      if (!property) {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: PropertyResponseDto.fromDocument(property),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch property",
      });
    }
  }

  /**
   * Update a property
   */
  async updateProperty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatePropertyDto: UpdatePropertyDto = req.body;

      const files = req.files as Express.Multer.File[];
      const imageBuffers = files?.map((file) => file.buffer) || [];

      const property = await propertyService.updateProperty(
        id as string,
        updatePropertyDto,
        imageBuffers
      );

      if (!property) {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Property updated successfully",
        data: PropertyResponseDto.fromDocument(property),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update property",
      });
    }
  }

  /**
   * Delete a property
   */
  async deleteProperty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const property = await propertyService.deleteProperty(id as string );

      if (!property) {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Property deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete property",
      });
    }
  }

  /**
   * Remove images from a property
   */
  async removeImages(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { imageUrls } = req.body;

      if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        res.status(400).json({
          success: false,
          message: "Please provide image URLs to remove",
        });
        return;
      }

      const property = await propertyService.removeImages(id as string, imageUrls);

      if (!property) {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Images removed successfully",
        data: PropertyResponseDto.fromDocument(property),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to remove images",
      });
    }
  }
}