import qs from "qs";
import curlirize from "axios-curlirize-ts";
import axios, { AxiosInstance } from "axios";

class BaseClient {
  private readonly _axios: AxiosInstance;
  private _token: string | null = null;
  private _refreshToken: string | null = null;

  constructor(
    baseURL: string,
    configs?: {
      headers?: { [key: string]: string };
      timeout?: number;
      logCurl?: boolean;
    }
  ) {
    this._axios = axios.create({
      baseURL: baseURL,
      headers: configs?.headers ?? {
        "Content-Type": "application/json",
      },
      timeout: configs?.timeout ?? 60000,
      paramsSerializer: (params) => qs.stringify(params),
    });

    if (configs?.logCurl) {
      curlirize(this._axios);
    }
  }

  public get client(): AxiosInstance {
    return this._axios;
  }

  public get token(): string | null {
    return this._token;
  }

  public get refreshToken(): string | null {
    return this._refreshToken;
  }

  setToken(token: string | null, refreshToken?: string | null) {
    this._token = token;
    this._refreshToken = refreshToken ?? null;
    if (token) {
      this._axios.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete this._axios.defaults.headers.Authorization;
    }
  }
}

export default BaseClient;
