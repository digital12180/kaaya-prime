import { z } from "zod";
export declare const createLeadSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    message: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=lead.validation.d.ts.map