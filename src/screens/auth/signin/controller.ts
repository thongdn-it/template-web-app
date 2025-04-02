import { redirect } from "next/navigation";

import { Routes } from "@configs";
import { CookiesUtils } from "@utils";

export const useSigninPageController = () => {
  const signin = async () => {
    const result = await CookiesUtils.saveTokens(
      "Bearer access_token",
      "refresh_token",
    );
    if (result) {
      console.log("Tokens saved successfully");
      redirect(Routes.home.default);
    }
  };

  return {
    signin,
  };
};
