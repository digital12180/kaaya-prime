import { z } from "zod";
export declare const createLandingPageSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    content: z.ZodString;
    formType: z.ZodEnum<{
        contact: "contact";
        consultation: "consultation";
        download: "download";
    }>;
    status: z.ZodOptional<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=landingPage.validation.d.ts.map