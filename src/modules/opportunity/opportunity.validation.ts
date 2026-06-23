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
    location,
    bedrooms,
    sqft,
    bathrooms,
    status,
    type,
  }: CreatePropertyDto = req.body;

  const errors: string[] = [];

  if (!title) errors.push("Title is required");
  if (!price) errors.push("Price is required");
  if (!location) errors.push("Location is required");
  if (!bedrooms) errors.push("Bedrooms is required");
  if (!sqft) errors.push("Square feet is required");
  if (bathrooms === undefined || bathrooms === null)
    errors.push("Bathrooms is required");
  if (!status) errors.push("Status is required");
  if (!type) errors.push("Type is required");

  if (status && !["For Rent", "For Buy"].includes(status)) {
    errors.push('Status must be either "For Rent" or "For Buy"');
  }

  if (type && !["Apartment", "House", "Condo", "Villa", "Townhouse"].includes(type)) {
    errors.push('Type must be one of: Apartment, House, Condo, Villa, Townhouse');
  }

  if (bathrooms !== undefined && bathrooms < 0) {
    errors.push("Bathrooms cannot be negative");
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