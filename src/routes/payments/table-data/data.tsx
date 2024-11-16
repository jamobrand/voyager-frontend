import * as z from "zod";

export const customerSchema = z.object({
  //TODO: fix all the types and nullable
  id: z.number(),
});

export type CustomerData = z.infer<typeof customerSchema>;
