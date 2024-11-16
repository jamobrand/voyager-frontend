import { API_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { Reservation } from "./types";

export const useGetReservation = (reservationId: number) => {
  return useQuery<Reservation>({
    queryKey: ["reservations", reservationId],
    queryFn: () =>
      fetch(`${API_URL}/v1/reservations/get-reservation/${reservationId}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
  });
};
