export interface CreateCareerDTO {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  cv?: {
    url: string;
    public_id: string;
    altText: string;
  };
}

export interface UpdateCareerDTO extends Partial<CreateCareerDTO> {}

export interface CareerResponseDTO {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  location: string;
  cv: {
    url: string;
    public_id: string;
    altText: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CareerQueryParams {
  page?: number;
  limit?: number;
  fullName?: string;
  location?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}