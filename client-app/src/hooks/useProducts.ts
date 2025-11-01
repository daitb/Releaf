import { useQuery } from "@tanstack/react-query"
import { api } from "../api/apiClient"

export const useProducts = (query?: string) => {
    return useQuery({
        queryKey: ["Product", query],
        queryFn: async () => {
            const res = await api.get("/Products", {
                params: {
                    q: query
                }
            })
            return res.data;
        }
    });
};