import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../api";

export const useGetListCoffeeQuery = () => {
  return useQuery({
    queryKey: ["get-coffee-list"],
    queryFn: apiClient.getCoffeeList,
  });
};
