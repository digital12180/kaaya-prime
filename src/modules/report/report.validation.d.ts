import { z } from "zod";
export declare const createReportSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    fileUrl: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=report.validation.d.ts.map