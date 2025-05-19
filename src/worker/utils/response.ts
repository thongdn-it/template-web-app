import { Context } from "hono";
import { RedirectStatusCode } from "hono/utils/http-status";

export const response = {
  success: <T>(
    c: Context,
    data: T | undefined,
    opts?: {
      code?: number;
      message?: string;
    }
  ) => {
    return c.json(
      {
        success: true,
        code: opts?.code || 200,
        message: opts?.message || "success",
        data,
      },
      200
    );
  },
  successWithPagination: <T>(
    c: Context,
    data: T[],
    pagination: {
      total: number;
      page: number;
      limit: number;
    },
    opts?: {
      code?: number;
      message?: string;
    }
  ) => {
    return c.json(
      {
        success: true,
        code: opts?.code || 200,
        message: opts?.message || "success",
        data: {
          items: data,
          pagination,
        },
      },
      200
    );
  },
  redirect: (
    c: Context,
    location: string | URL,
    opts?: {
      code?: RedirectStatusCode;
    }
  ) => {
    return c.redirect(location, opts?.code);
  },
  error: (
    c: Context,
    errorCode?: number,
    opts?: {
      message?: string;
      data?: unknown;
    }
  ) => {
    return c.json(
      {
        success: false,
        code: errorCode || 400,
        message: opts?.message || "error",
        data: opts?.data ?? undefined,
      },
      400
    );
  },
};
