import { BaseClient } from "@utils";

export class APIClient extends BaseClient {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL ?? "", {
      logCurl: process.env.NODE_ENV === "development",
    });
  }
}

export const apiClient = new APIClient();
