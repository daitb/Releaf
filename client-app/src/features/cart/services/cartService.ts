import { apiClient } from "@shared/api/apiClient";

export async function fetchCartCount(): Promise<number> {
    const response = await apiClient.get("/Cart/count");
    return response.data.data?.count ?? 0;
}

