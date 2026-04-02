import { z } from "zod";

export const createBlogSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200),

  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug must be URL-friendly"),

  content: z
    .string()
    .min(10, "Content is too short"),

  image: z
    .string()
    .url("Image must be a valid URL")
    .optional(),

  metaTitle: z
    .string()
    .max(200)
    .optional(),

  metaDescription: z
    .string()
    .max(300)
    .optional(),

  status: z
    .enum(["draft", "published"])
    .optional(),
});