import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../api";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const useGetColorListQuery = () => {
  return useQuery({
    queryKey: ["get-color-list"],
    queryFn: apiClient.getColorList,
    staleTime: ONE_DAY_MS,
    gcTime: ONE_DAY_MS,
  });
};
