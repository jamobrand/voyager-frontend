import * as z from "zod";

export const chaletSchema = z.object({
  //TODO: fix all the types and nullable
  id: z.number(),
  name: z.string(),
});

export type ChaletData = z.infer<typeof chaletSchema>;
