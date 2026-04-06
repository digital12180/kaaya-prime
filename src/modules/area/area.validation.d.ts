import { z } from "zod";
export declare const createAreaSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    content: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    metaTitle: z.ZodOptional<z.ZodString>;
    metaDescription: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=area.validation.d.ts.map