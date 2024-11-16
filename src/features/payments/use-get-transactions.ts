import { API_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { TransactionResponse } from "./types";

   export const useGetTransactions = () => {
    return useQuery<TransactionResponse[]>({
      queryKey: ["transactions"],
      queryFn: () =>
        fetch(`${API_URL}/v1/payments/get-payments`, {
          // credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json()),
    });
  };