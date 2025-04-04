import { redirect } from "next/navigation";

import { Routes } from "@constants";
import { CookiesUtils } from "@utils";
import { CoffeeModel, useGetListCoffeeQuery } from "@data";

export const useHomePageController = () => {
  const { data, isLoading, error } = useGetListCoffeeQuery();

  const onCoffeeItemClick = (coffee: CoffeeModel) => {
    redirect(Routes.detail.default(coffee.id));
  };

  const onSignOutClick = () => {
    CookiesUtils.removeTokens();
    redirect(Routes.auth.signin);
  };

  return {
    data: data?.data,
    error: error,
    isLoading,
    onCoffeeItemClick,
    onSignOutClick,
  };
};
