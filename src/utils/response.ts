// src/utils/response.ts

import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";

export const response = {
  success: <T>(
    c: Context,
    data: T,
    statusCode: StatusCode = 200,
    opts?: {
      message?: string;
    }
  ) => {
    return c.json(
      {
        success: true,
        data,
        message: opts?.message ?? "success",
      },
      statusCode
    );
  },
  error: (
    c: Context,
    statusCode: StatusCode = 400,
    opts?: {
      errorCode?: number;
      errorMessage?: string;
      errorData?: any;
    }
  ) => {
    return c.json(
      {
        success: false,
        message: opts?.errorMessage ?? "error",
        code: opts?.errorCode ?? statusCode,
        data: opts?.errorData ?? null,
      },
      statusCode
    );
  },
};
