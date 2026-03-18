import { useApi } from "@/lib/axios";
import { Chat } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useChats = () => {
  const { apiWithAuth } = useApi();

  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const { data } = await apiWithAuth<Chat[]>({
        method: "get",
        url: "/chats",
      });
      return data;
    },
  });
};
