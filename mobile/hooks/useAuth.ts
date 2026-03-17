import { useApi } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useAuthCallback = () => {
  const api = useApi();

  return useMutation({
    mutationFn: async () => {
      console.log("mutationFn");
      try {
        const response = await api.post("/auth/callback");
        console.log("Auth callback response:", response?.data);
        return response.data;
      } catch (error: any) {
        console.error("Auth callback failed", {
          message: error?.message,
          baseURL: api.defaults.baseURL,
          code: error?.code,
          response: error?.response?.data,
        });
        throw error;
      }
    },
  });
};
