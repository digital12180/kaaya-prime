export interface CreateOpportunityDTO {
  title: string;
  description: string;
  location: string;
  images?: string[];
  status?: "active" | "inactive" | "sold";
}