import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../api";

export const useGetColorListQuery = () => {
  return useQuery({
    queryKey: ["get-color-list"],
    queryFn: apiClient.getColorList,
  });
};
