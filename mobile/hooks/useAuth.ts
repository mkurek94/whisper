import { useApi } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useAuthCallback = () => {
  const { apiWithAuth } = useApi();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiWithAuth({
        method: "post",
        url: "/auth/callback",
      });
      return data;
    },
  });
};
