import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../api";

export const useGetWineListQuery = () => {
  return useQuery({
    queryKey: ["get-wine-list"],
    queryFn: apiClient.getWineList,
  });
};
