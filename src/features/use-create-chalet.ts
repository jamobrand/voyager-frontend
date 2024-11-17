import axios, { AxiosError } from "axios";
import { API_URL } from "@/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export type FormValues = {
  name: string;
  chaletType: string;
  capacity: number;
  price: number;
  description?: string;
  chaletImage?: string;
  amenities: string[];
  available: boolean;
  maintenanceMode: boolean;
};

export type ChaletResponse = {
 mesage:string
};

export const useCreateChalet = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation<ChaletResponse, AxiosError, FormValues>({
    mutationFn: async (chalet: FormValues) => {
      const { data } = await axios.post<ChaletResponse>(`${API_URL}/v1/chalets/add-chalet`, chalet, {
        headers: {
          "Content-Type": "application/json",
        },
        // withCredentials: true, // Uncomment if credentials are needed
      });
      return data;
    },
    onError: (error:Error) => {
      const errorMessage = error.message || "Failed to create chalet";
      toast({
        variant: "destructive",
        title: "Chalet creation failed",
        description: errorMessage,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chalets"] });
        toast({
        variant: "success",
        title: "Chalet created",
        description: "Chalet created successfully",
      });
      navigate("/admin/chalets");
    },
  });
};
