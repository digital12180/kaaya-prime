import { Types } from 'mongoose';

// ============ SUB-DTO INTERFACES ============

export interface IAddressDto {
  line: string;
  city: string;
  area: string;
  country: string;
}


export interface IPropertySpecDto {
  label: string;
  value: string;
}

export interface IAmenityDto {
  label: string;
}

export interface IImageDto {
  url: string;
  alt: string;
}

export interface IFloorPlanDto {
  url: string;
  label: string;
}

export interface IAgentDto {
  id?: string;
  name: string;
  role: string;
  image?: string;
  phone?: string;
  email?: string;
}

export interface INeighborhoodInsightDto {
  title: string;
  subtitle: string;
  distance: string;
  rating: string;
}

export interface IPropertyHighlightDto {
  text: string;
}

// ============ MAIN DTO INTERFACES ============

export interface ICreatePropertyDto {
  title: string;
  price: number;
  currency?: string;
  priceUnit: 'month' | 'year' | 'total';
  listingType: 'rent' | 'sale';
  status?: 'Active' | 'Pending' | 'Sold' | 'Rented';
  address: IAddressDto;
  listedAt?: string;
  description: string;
  specs: IPropertySpecDto[];
  amenities: IAmenityDto[];
  images: string[];
  videoTourUrl?: string;
  floorPlan: IFloorPlanDto;
  agent: IAgentDto;
  neighborhoodInsights: INeighborhoodInsightDto[];
  highlights: IPropertyHighlightDto[];
}

export interface IUpdatePropertyDto {
  title?: string;
  price?: number;
  currency?: string;
  priceUnit?: 'month' | 'year' | 'total';
  listingType?: 'rent' | 'sale';
  status?: 'Active' | 'Pending' | 'Sold' | 'Rented';
  address?: IAddressDto;
  listedAt?: string;
  description?: string;
  specs?: IPropertySpecDto[];
  amenities?: IAmenityDto[];
  images?: string[];
  videoTourUrl?: string;
  floorPlan?: IFloorPlanDto;
  agent?: IAgentDto;
  neighborhoodInsights?: INeighborhoodInsightDto[];
  highlights?: IPropertyHighlightDto[];
}

export interface IQueryPropertyDto {
  search?: string;
  listingType?: 'rent' | 'sale';
  status?: 'Active' | 'Pending' | 'Sold' | 'Rented';
  city?: string;
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

