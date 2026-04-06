import { z } from "zod";
export const createLandingPageSchema = z.object({
    title: z.string().min(3),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    content: z.string().min(10),
    formType: z.enum(["contact", "consultation", "download"]),
    status: z.enum(["active", "inactive"]).optional(),
});
//# sourceMappingURL=landingPage.validation.js.map