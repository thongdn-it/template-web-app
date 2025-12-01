import { ColorModel } from "../../models/color";
import { apiClient, APIClient } from "../client";
import { BaseResponse } from "../response";

declare module "../client" {
  interface APIClient {
    getColorList: () => Promise<BaseResponse<ColorModel[]>>;
  }
}

APIClient.prototype.getColorList = async function () {
  return apiClient.client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/csscolornames/colors`,
  );
};
