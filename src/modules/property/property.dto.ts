import { Types } from 'mongoose';

// ============ SUB-DTO INTERFACES ============

export interface IAddressDto {
  line: string;
  city: string;
  area: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ICoordinatesDto {
  lat: number;
  lng: number;
}

export interface IPropertySpecDto {
  label: string;
  value: string;
  icon: string;
  valueColor?: string;
}

export interface IAmenityDto {
  label: string;
  icon: string;
}

export interface IImageDto {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface IFloorPlanDto {
  url: string;
  label: string;
}

export interface IAgentDto {
  id: string;
  name: string;
  role: string;
  image?: string;
  dealsCount: number;
  rating: number;
  phone?: string;
  email?: string;
}

export interface INeighborhoodInsightDto {
  icon: string;
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
  verified?: boolean;
  noHiddenFees?: boolean;
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
  verified?: boolean;
  noHiddenFees?: boolean;
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

