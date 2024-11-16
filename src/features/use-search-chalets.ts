import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/config";

interface SearchParams {
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
}

export const useSearchChalets = (params?: SearchParams) => {
  return useQuery({
    queryKey: ['chalets', params],
    queryFn: async () => {
      if (!params) {
        const { data } = await axios.get(`${API_URL}/v1/chalets/get-chalets`);
        return data;
      }
      
      // You'll need to implement this endpoint in your backend
      const { data } = await axios.get(`${API_URL}/v1/chalets/search`, {
        params: {
          checkIn: params.checkIn.toISOString(),
          checkOut: params.checkOut.toISOString(),
          adults: params.adults,
          children: params.children,
        }
      });
      return data;
    },
    enabled: true // Query will run immediately if no params, or when params change
  });
};