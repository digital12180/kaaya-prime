export interface CreateLeadDTO {
  name: string;
  email: string;
  phone: string;
  message?: string;
  source?: string;
  page?: string;
}