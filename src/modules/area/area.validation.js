import { z } from "zod";
export const createAreaSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100),
    slug: z
        .string()
        .min(3)
        .regex(/^[a-z0-9-]+$/, "Slug must be URL-friendly"),
    content: z
        .string()
        .min(10, "Content is too short"),
    image: z
        .string()
        .url("Invalid image URL")
        .optional(),
    metaTitle: z
        .string()
        .max(200)
        .optional(),
    metaDescription: z
        .string()
        .max(300)
        .optional(),
});
//# sourceMappingURL=area.validation.js.map