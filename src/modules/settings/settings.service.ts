import { z } from "zod";

export const updateSettingSchema = z.object({
  key: z.string(),
  value: z.any(),
});