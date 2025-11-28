import { WineModel } from "../../models/wine";
import { apiClient, APIClient } from "../client";
import { BaseResponse } from "../response";

declare module "../client" {
  interface APIClient {
    getWineList: () => Promise<BaseResponse<WineModel[]>>;
  }
}

APIClient.prototype.getWineList = async function () {
  return apiClient.client.get("/wines/reds");
};
