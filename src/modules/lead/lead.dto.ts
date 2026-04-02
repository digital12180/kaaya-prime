// types/lead.types.ts

export interface CreateLeadDto {
  name: string;
  email: string;
  phone: string;
  message?: string;
  source?: string;
  page?: string;
}

export interface UpdateLeadDto {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  source?: string;
  page?: string;
}

export interface LeadResponseDto {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  source?: string;
  page?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationDto {
  page?: number;
  limit?: number;
  search?: string;
  source?: string;
}
export const mapLeadResponseDto = (lead: any): LeadResponseDto => ({
  _id: lead._id?.toString(),
  name: lead.name,
  email: lead.email,
  phone: lead.phone,
  message: lead.message,
  source: lead.source,
  page: lead.page,
  createdAt: lead.createdAt,
  updatedAt: lead.updatedAt,
});