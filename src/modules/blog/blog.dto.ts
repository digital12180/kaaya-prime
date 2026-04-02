export interface CreateBlogDTO {
  title: string;
  slug: string;
  content: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  status?: "draft" | "published";
}