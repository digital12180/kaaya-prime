import type { IProperty } from "./property.model.js";

export interface CreatePropertyDto {
  title: string;
  price: string;
  location: string;
  bedrooms: string;
  sqft: string;
  bathrooms: number;
  status: "For Rent" | "For Buy";
  type: "Apartment" | "House" | "Condo" | "Villa" | "Townhouse";
  images?: string[];
}

export class CreatePropertyDto implements CreatePropertyDto {
  title!: string;
  price!: string;
  location!: string;
  bedrooms!: string;
  sqft!: string;
  bathrooms!: number;
  status!: "For Rent" | "For Buy";
  type!: "Apartment" | "House" | "Condo" | "Villa" | "Townhouse";
  images?: string[];
}

export interface UpdatePropertyDto {
  title?: string;
  price?: string;
  location?: string;
  bedrooms?: string;
  sqft?: string;
  bathrooms?: number;
  status?: "For Rent" | "For Buy";
  type?: "Apartment" | "House" | "Condo" | "Villa" | "Townhouse";
  images?: string[];
}

export class UpdatePropertyDto implements UpdatePropertyDto {
  title?: string;
  price?: string;
  location?: string;
  bedrooms?: string;
  sqft?: string;
  bathrooms?: number;
  status?: "For Rent" | "For Buy";
  type?: "Apartment" | "House" | "Condo" | "Villa" | "Townhouse";
  images?: string[];
}

export class PropertyResponseDto {
  id: string;
  title: string;
  slug: string;
  price: string;
  location: string;
  images: string[];
  bedrooms: string;
  sqft: string;
  bathrooms: number;
  status: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(property: IProperty) {
    this.id = property._id.toString();
    this.title = property.title;
    this.slug = property.slug;
    this.price = property.price;
    this.location = property.location;
    this.images = property.images || [];
    this.bedrooms = property.bedrooms;
    this.sqft = property.sqft;
    this.bathrooms = property.bathrooms;
    this.status = property.status;
    this.type = property.type;
    this.createdAt = property.createdAt;
    this.updatedAt = property.updatedAt;
  }

  static fromDocument(property: IProperty): PropertyResponseDto {
    return new PropertyResponseDto(property);
  }

  static fromDocuments(properties: IProperty[]): PropertyResponseDto[] {
    return properties.map(property => new PropertyResponseDto(property));
  }
}