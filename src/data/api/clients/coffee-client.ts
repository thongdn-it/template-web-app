import { BaseResponse } from "../response";
import { apiClient, APIClient } from "../client";
import { CoffeeModel } from "../../models/coffee";

declare module "../client" {
  interface APIClient {
    getCoffeeList: () => Promise<BaseResponse<CoffeeModel[]>>;
  }
}

APIClient.prototype.getCoffeeList = async function () {
  return apiClient.client.get("coffee/hot");
};
