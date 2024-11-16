import { API_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";

export type ChaletResponse = {
    mesage:string;
    id: number;
    name: string;
    chaletType: string;
    capacity: number;
    price: number;
    chaletImage?: string;
    description?: string;
    amenities: string[];
    available: boolean;
    maintenanceMode: boolean;
   };

   export const useGetChalets = () => {
    return useQuery<ChaletResponse[]>({
      queryKey: ["chalets"],
      queryFn: () =>
        fetch(`${API_URL}/v1/chalets/get-chalets`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json()),
    });
  };