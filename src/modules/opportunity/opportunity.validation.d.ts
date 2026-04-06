import { z } from "zod";
export declare const createOpportunitySchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    location: z.ZodString;
    images: z.ZodOptional<z.ZodArray<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
        sold: "sold";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=opportunity.validation.d.ts.map