import { z } from "zod";

export const createOpportunitySchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200),

  description: z
    .string()
    .min(10, "Description is too short"),

  location: z
    .string()
    .min(2, "Location is required"),

  images: z
    .array(z.string().url("Invalid image URL"))
    .optional(),

  status: z
    .enum(["active", "inactive", "sold"])
    .optional(),
});