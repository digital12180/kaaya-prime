import mongoose, { Schema, Document } from 'mongoose';

// Sub-documents interfaces
interface IPropertySpec {
  label: string;
  value: string;
  icon: string;
  valueColor?: string;
}

interface IAmenity {
  label: string;
  icon: string;
}

interface IAgent {
  id: string;
  name: string;
  role: string;
  image: string;
  dealsCount: number;
  rating: number;
  phone?: string;
  email?: string;
}

interface INeighborhoodInsight {
  icon: string;
  title: string;
  subtitle: string;
  distance: string;
  rating: string;
}

interface IPropertyHighlight {
  text: string;
}

interface IAddress {
  line: string;
  city: string;
  area: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface IImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

interface IFloorPlan {
  url: string;
  label: string;
}

export interface IProperty extends Document {
  id: string;
  title: string;
  price: number;
  currency: string;
  priceUnit: 'month' | 'year' | 'total';
  listingType: 'rent' | 'sale';
  status: 'Active' | 'Pending' | 'Sold' | 'Rented';
  address: IAddress;
  listedAt: Date;
  description: string;
  specs: IPropertySpec[];
  amenities: IAmenity[];
  images: IImage[];
  videoTourUrl?: string;
  floorPlan: IFloorPlan;
  agent: IAgent;
  neighborhoodInsights: INeighborhoodInsight[];
  highlights: IPropertyHighlight[];
  verified: boolean;
  noHiddenFees: boolean;
}

const PropertySchema = new Schema<IProperty>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    priceUnit: {
      type: String,
      enum: ['month', 'year', 'total'],
      required: true,
    },
    listingType: {
      type: String,
      enum: ['rent', 'sale'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Sold', 'Rented'],
      default: 'Active',
    },
    address: {
      line: { type: String, required: true },
      city: { type: String, required: true },
      area: { type: String, required: true },
      country: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    listedAt: { type: Date, default: Date.now },
    description: { type: String, required: true },
    specs: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
        icon: { type: String, required: true },
        valueColor: { type: String },
      },
    ],
    amenities: [
      {
        label: { type: String, required: true },
        icon: { type: String, required: true },
      },
    ],
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    videoTourUrl: { type: String },
    floorPlan: {
      url: { type: String, required: true },
      label: { type: String, required: true },
    },
    agent: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String, required: true },
      image: { type: String, required: true },
      dealsCount: { type: Number, required: true },
      rating: { type: Number, required: true },
      phone: { type: String },
      email: { type: String },
    },
    neighborhoodInsights: [
      {
        icon: { type: String, required: true },
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        distance: { type: String, required: true },
        rating: { type: String, required: true },
      },
    ],
    highlights: [
      {
        text: { type: String, required: true },
      },
    ],
    verified: { type: Boolean, default: false },
    noHiddenFees: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Pre-save middleware to ensure coordinates are numbers
PropertySchema.pre('save', function () {
  if (this.address.coordinates) {
    this.address.coordinates.lat = Number(this.address.coordinates.lat);
    this.address.coordinates.lng = Number(this.address.coordinates.lng);
  }
//   next();
});

// Indexes for better query performance
PropertySchema.index({ 'address.city': 1 });
PropertySchema.index({ 'address.area': 1 });
PropertySchema.index({ status: 1 });
PropertySchema.index({ listingType: 1 });
PropertySchema.index({ price: 1 });

export const Property = mongoose.model<IProperty>('Property', PropertySchema);