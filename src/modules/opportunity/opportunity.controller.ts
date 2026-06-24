import type { Request, Response } from "express";
import { PropertyService } from "./opportunity.service.js";
import { CreatePropertyDto } from "./opportunity.dto.js";
import { UpdatePropertyDto } from "./opportunity.dto.js";
import { PropertyResponseDto } from "./opportunity.dto.js";


const propertyService = new PropertyService();
export const FILTER_OPTIONS = {
  status: ["For Rent", "For Buy"],
  location: ["Mumbai", "Delhi", "Bangalore"],
  price: ["0-50L", "50L-1Cr", "1Cr+"],
  type: ["Apartment", "House", "Condo", "Villa", "Townhouse"],
  bedrooms: ["1", "2", "3", "4", "5+"],
  mobileQuickTypes: ["Apartment", "Villa", "House"]
};
export class PropertyController {
  /**
   * Create a new property
   */
  async createProperty(
    req: Request,
    res: Response
  ): Promise<void> {
    try {

      const createPropertyDto: CreatePropertyDto = {
        ...req.body,

        specs:
          typeof req.body.specs === "string"
            ? JSON.parse(req.body.specs)
            : req.body.specs || [],

        amenities:
          typeof req.body.amenities === "string"
            ? JSON.parse(req.body.amenities)
            : req.body.amenities || []
      };

      const files = req.files as {
        imageUrl?: Express.Multer.File[];
        images?: Express.Multer.File[];
      };

      const mainImage =
        files?.imageUrl?.[0]?.buffer || null;

      const galleryImages =
        files?.images?.map(
          file => file.buffer
        ) || [];

      const property =
        await propertyService.createProperty(
          createPropertyDto,
          mainImage,
          galleryImages
        );

      res.status(201).json({
        success: true,
        message: "Property created successfully",
        data: property
      });

    } catch (error: any) {

      console.error("error--------", error);

      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to create property"
      });
    }
  }

  /**
   * Get all properties
   */
  /**
  * Get all properties with filters
  */
  async getProperties(req: Request, res: Response): Promise<void> {
    try {
      // Extract filter parameters from query
      const {
        status,
        type,
        location,
        price,
        bedrooms,
        search,
        page = 1,
        limit = 10,
      } = req.query;

      // Parse price range
      let minPrice: string | undefined;
      let maxPrice: string | undefined;

      if (price && price !== "All") {
        const priceMatch = (price as string).match(/(\d+[K]?)\s*-\s*(\d+[K]?)/);
        if (priceMatch) {
          minPrice = priceMatch[1];
          maxPrice = priceMatch[2];
        } else if ((price as string).includes("+")) {
          const match = (price as string).match(/(\d+[K]?)\+/);
          if (match) {
            minPrice = match[1];
          }
        }
      }

      // Build filters object
      const filters = {
        status: status && status !== "All" ? status as string : undefined,
        type: type && type !== "All" ? type as string : undefined,
        location: location && location !== "All" ? location as string : undefined,
        minPrice,
        maxPrice,
        bedrooms: bedrooms && bedrooms !== "All" ? bedrooms as string : undefined,
        search: search as string,
        page: Number(page),
        limit: Number(limit),
      };

      // Get properties with filters
      const { properties, total } = await propertyService.getProperties(filters as any);

      // Get filter options for response

      const filterOptions = {
        status: FILTER_OPTIONS.status,
        location: FILTER_OPTIONS.location,
        price: FILTER_OPTIONS.price,
        type: FILTER_OPTIONS.type,
        bedrooms: FILTER_OPTIONS.bedrooms,
        mobileQuickTypes: FILTER_OPTIONS.mobileQuickTypes,
      };

      // Get active filters
      const activeFilters = {
        status: status || "All",
        type: type || "All",
        location: location || "All",
        price: price || "All",
        bedrooms: bedrooms || "All",
        search: search || "",
      };

      res.status(200).json({
        success: true,
        data: PropertyResponseDto.fromDocuments(properties),
        filters: {
          options: filterOptions,
          active: activeFilters,
        },
        pagination: {
          total,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.ceil(total / (filters.limit || 10)),
          hasNext: filters.page < Math.ceil(total / (filters.limit || 10)),
          hasPrev: filters.page > 1,
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
      const property = await propertyService.deleteProperty(id as string);

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