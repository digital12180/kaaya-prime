import { z } from "zod";
export const createLeadSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100),
    email: z
        .string()
        .email("Invalid email format"),
    phone: z
        .string()
        .min(10, "Phone must be at least 10 digits")
        .max(15),
    message: z
        .string()
        .max(1000)
        .optional(),
    source: z
        .string()
        .optional(),
    page: z
        .string()
        .optional(),
});
//# sourceMappingURL=lead.validation.js.map