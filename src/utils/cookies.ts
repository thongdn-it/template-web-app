import Cookies from "js-cookie";

export const CookiesKeys = {
  access_token: "access_token",
  refresh_token: "refresh_token",
};
export class CookiesUtils {
  static saveTokens = async (accessToken: string, refreshToken?: string) => {
    Cookies.set(CookiesKeys.access_token, accessToken, {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
    });
    if (refreshToken) {
      Cookies.set(CookiesKeys.refresh_token, refreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
    }
    return true;
  };

  static getAccessToken = async () => {
    return Cookies.get(CookiesKeys.access_token);
  };

  static getRefreshToken = async () => {
    return Cookies.get(CookiesKeys.refresh_token);
  };

  static removeTokens = async () => {
    Cookies.remove(CookiesKeys.access_token);
    Cookies.remove(CookiesKeys.refresh_token);
    return true;
  };
}
