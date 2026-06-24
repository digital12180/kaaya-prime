import type { IProperty } from "./property.model.js";

export interface CreatePropertyDto {
  title: string;
  price: string;

  status: "For Rent" | "For Buy";

  type:
  | "Apartment"
  | "House"
  | "Condo"
  | "Villa"
  | "Townhouse";

  location: string;

  description: string;

  specs: {
    label: string;
    value: string;
  }[];

  amenities: string[];

  floorPlanUrl?: string;

  videoUrl?: string;

  imageUrl?: string;
  images?: string[];
}

export class CreatePropertyDto implements CreatePropertyDto {
  title!: string;
  price!: string;
  status!: "For Rent" | "For Buy";
  type!: "Apartment" | "House" | "Condo" | "Villa" | "Townhouse";
  location!: string;
  description!: string;
  imageUrl?: string;
  images?: string[];
  specs!: {
    label: string;
    value: string;
  }[];
  amenities!: string[];
  floorPlanUrl?: string;
  videoUrl?: string;
}

export interface UpdatePropertyDto {
  title?: string;
  price?: string;
  status?: "For Rent" | "For Buy";
  type?: "Apartment" | "House" | "Condo" | "Villa" | "Townhouse";
  location?: string;
  description?: string;
  imageUrl?: string;
  specs?: {
    label: string;
    value: string;
  }[];
  amenities?: string[];
  floorPlanUrl?: string;
  videoUrl?: string;
}

export class UpdatePropertyDto implements UpdatePropertyDto {
  title?: string;
  price?: string;
  status?: "For Rent" | "For Buy";
  type?: "Apartment" | "House" | "Condo" | "Villa" | "Townhouse";
  location?: string;
  description?: string;
  imageUrl?: string;
  specs?: {
    label: string;
    value: string;
  }[];
  amenities?: string[];
  floorPlanUrl?: string;
  videoUrl?: string;
}

export class PropertyResponseDto {
  id: string;
  title: string;
  slug: string;
  price: string;
  status: string;
  type: string;
  location: string;
  description: string;
  imageUrl: string;
  images: string[];
  specs: {
    label: string;
    value: string;
  }[];
  amenities: string[];
  floorPlanUrl: string;
  videoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(property: IProperty) {
    this.id = property._id.toString();
    this.title = property.title;
    this.slug = property.slug;
    this.price = property.price;
    this.status = property.status;
    this.type = property.type;
    this.location = property.location;
    this.description = property.description;
    this.imageUrl = property.imageUrl;
    this.images = property.images || [];
    this.specs = property.specs || [];
    this.amenities = property.amenities || [];
    this.floorPlanUrl = property.floorPlanUrl;
    this.videoUrl = property.videoUrl as string;
  }

  static fromDocument(property: IProperty): PropertyResponseDto {
    return new PropertyResponseDto(property);
  }

  static fromDocuments(properties: IProperty[]): PropertyResponseDto[] {
    return properties.map(property => new PropertyResponseDto(property));
  }
}