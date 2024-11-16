import { z } from "zod";

export const chaletSchema = z.object({
  name: z.string().min(1, {
    message: "Chalet Name is required",
  }),
  chaletType: z.enum(["Duplex Lower", "Duplex Upper", "Stand Alone Unit"]),
  capacity: z.number().min(1),
  price: z.number().positive(),
  description: z.string().optional(),
  chaletImage:z.string().optional(),
  amenities: z.array(z.string()),
  available: z.boolean(),
  maintenanceMode: z.boolean(),
});
