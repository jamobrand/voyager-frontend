import { API_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";

export type ReservationsResponse = {
    id: number;
    adults:number;
    chalet:{
        id: number;
        name: string;
        chaletType: string;
        capacity: number;
        price: number;
        description?: string;
        chaletImage?: string;
        amenities?: string[];
        available: boolean;
        maintenanceMode: boolean;
    };
    checkIn: string;
    checkOut: string;
    children: number;
    chaletId: number;
    customerId: number;
    status: string;
    paymentStatus: string;
    totalCost: number;
    transactionId: string;
   };

   export const useGetReservations = () => {
    return useQuery<ReservationsResponse[]>({
      queryKey: ["reservations"],
      queryFn: () =>
        fetch(`${API_URL}/v1/reservations/get-reservations`, {
        //   credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json()),
    });
  };