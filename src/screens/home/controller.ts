import { CoffeeModel, useGetListCoffeeQuery } from "@data";
import { Routes } from "@src/configs";
import { CookiesUtils } from "@src/utils";
import { redirect } from "next/navigation";

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
