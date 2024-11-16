import * as z from "zod";

export const reservationSchema = z.object({
  //TODO: fix all the types and nullable
  id: z.number(),
});

export type ReservationData = z.infer<typeof reservationSchema>;
