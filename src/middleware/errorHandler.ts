// src/middleware/errorHandler.ts

import { MiddlewareHandler } from "hono";

import { response } from "../utils";

export const errorHandler = (): MiddlewareHandler => {
  return async (c, next) => {
    try {
      await next();
    } catch (err) {
      return response.error(c, 500, {
        errorMessage: "Internal Server Error",
        errorData: err,
      });
    }
  };
};
