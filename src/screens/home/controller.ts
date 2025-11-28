import { redirect } from "next/navigation";

import { Routes } from "@constants";
import { WineModel, useGetWineListQuery } from "@data";
import { CookiesUtils } from "@utils";

export const useHomePageController = () => {
  const { data, isLoading, error } = useGetWineListQuery();

  const onWineItemClick = (wine: WineModel) => {
    redirect(Routes.detail.default(wine.id));
  };

  const onSignOutClick = () => {
    CookiesUtils.removeTokens();
    redirect(Routes.auth.signin);
  };

  return {
    data: data?.data,
    error: error,
    isLoading,
    onWineItemClick,
    onSignOutClick,
  };
};
