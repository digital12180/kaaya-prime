import type { Request, Response, NextFunction } from "express";
import { CreatePropertyDto } from "./opportunity.dto.js";

export const validateProperty = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const {
    title,
    price,
    status,
    type,
    location,
    description,
    imageUrl,
    specs,
    amenities,
    floorPlanUrl,
    videoUrl,
  }: CreatePropertyDto = req.body;

  const errors: string[] = [];

  // Required fields
  if (!title) errors.push("Title is required");
  if (!price) errors.push("Price is required");
  if (!status) errors.push("Status is required");
  if (!type) errors.push("Type is required");
  if (!location) errors.push("Location is required");
  if (!description) errors.push("Description is required");
  if (!imageUrl) errors.push("Image URL is required");
  if (!floorPlanUrl) errors.push("Floor plan URL is required");

  // Status validation
  if (status && !["For Rent", "For Buy"].includes(status)) {
    errors.push('Status must be either "For Rent" or "For Buy"');
  }

  // Type validation
  if (type && !["Apartment", "House", "Condo", "Villa", "Townhouse"].includes(type)) {
    errors.push('Type must be one of: Apartment, House, Condo, Villa, Townhouse');
  }

  // Specs validation
  if (specs && !Array.isArray(specs)) {
    errors.push("Specs must be an array");
  } else if (specs) {
    specs.forEach((spec: any, index: number) => {
      if (!spec.label) errors.push(`Spec at index ${index} must have a label`);
      if (!spec.value) errors.push(`Spec at index ${index} must have a value`);
    });
  }

  // Amenities validation
  if (amenities && !Array.isArray(amenities)) {
    errors.push("Amenities must be an array");
  }

  // Video URL validation (optional)
  if (videoUrl && typeof videoUrl !== "string") {
    errors.push("Video URL must be a string");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      errors,
    });
    return;
  }

  next();
};