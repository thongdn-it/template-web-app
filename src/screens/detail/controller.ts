import { useEffect, useState } from "react";

import { redirect } from "next/navigation";

import { CoffeeModel, useGetListCoffeeQuery } from "@data";

export const useDetailPageController = (id: number) => {
  const { data: dataList, isLoading, error } = useGetListCoffeeQuery();
  const [data, setData] = useState<CoffeeModel | null>(null);

  useEffect(() => {
    if (dataList?.data) {
      const coffee = dataList.data.find(
        (coffee: CoffeeModel) => coffee.id === id
      );
      if (!coffee) {
        redirect("/");
      }
      setData(coffee);
    }
  }, [id, dataList]);

  return {
    data,
    error: error,
    isLoading,
  };
};
