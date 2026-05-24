import { ColorModel } from "../../models/color";
import { apiClient, APIClient } from "../client";
import { BaseResponse } from "../response";

declare module "../client" {
  interface APIClient {
    getColorList: () => Promise<BaseResponse<ColorModel[]>>;
  }
}

APIClient.prototype.getColorList = async function () {
  const res = await apiClient.client.get<{ colors: ColorModel[] }>(
    "https://www.csscolorsapi.com/api/colors",
  );
  return { ...res, data: res.data.colors };
};
