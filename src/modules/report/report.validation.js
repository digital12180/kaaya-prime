import { z } from "zod";
export const createReportSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    fileUrl: z.string().url(),
    image: z.string().url().optional(),
    status: z.enum(["active", "inactive"]).optional(),
});
//# sourceMappingURL=report.validation.js.map