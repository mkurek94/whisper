import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/axios";
import { User } from "@/types";

export const useUsers = () => {
  const { apiWithAuth } = useApi();

  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await apiWithAuth<User[]>({
        method: "GET",
        url: "/users",
      });
      return data;
    },
  });
};
