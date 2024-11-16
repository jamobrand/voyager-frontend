import { API_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { CustomerResponse } from "./types";

   export const useGetCustomers = () => {
    return useQuery<CustomerResponse[]>({
      queryKey: ["customers"],
      queryFn: () =>
        fetch(`${API_URL}/v1/customers/get-customers`, {
          // credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json()),
    });
  };