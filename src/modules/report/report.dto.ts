export interface ICreateReportDto {
  title: string;
  slug: string;
  region?: string;
  growth?: string;
  description: string;
  period?: string;
  imageUrl: string;
  fileUrl: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  type?: "all" | "marketinsights" | "annualreport";
}

export interface IUpdateReportDto {
  title?: string;
  slug?: string;
  region?: string;
  growth?: string;
  description?: string;
  period?: string;
  fileSize?: string;
  fileType?: string;
  imageUrl?: string;
  fileUrl?: string;
  type?: "all" | "marketinsights" | "annualreport";
}

export interface IReportQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  type?: "all" | "marketinsights" | "annualreport";
  region?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IPaginationDto {
  page?: number;
  limit?: number;
  search?: string;
  type?: "all" | "marketinsights" | "annualreport";
  region?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}