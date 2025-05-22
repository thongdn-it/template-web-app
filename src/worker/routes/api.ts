import { basicAuth } from "hono/basic-auth";
import { Scalar } from "@scalar/hono-api-reference";

import { ERRORS } from "../constants";
import { APIOpenAPIHono } from "./type";
import { randomString, response } from "../utils";

export const apiRoute = new APIOpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      if (result.error.name === "ZodError") {
        const issues = result.error.issues.reduce((acc, issue) => {
          const { path, message, code } = issue;
          const pathString = path.join(".");
          acc[pathString] = { message, code };
          return acc;
        }, {} as Record<string, { message: string; code: string }>);

        return c.json(
          response.error(ERRORS.BAD_REQUEST.code, {
            message: ERRORS.BAD_REQUEST.message,
            data: issues,
          }),
          400
        );
      }
    }
  },
});

// - Swagger UI - //
export const docPath = `doc-${randomString()}`;
apiRoute.doc(`/${docPath}`, (c) => {
  return {
    info: {
      title: "Hono API Documentation",
      version: "v1",
    },
    openapi: "3.1.0",
    servers: [
      {
        url: `${new URL(c.req.url).origin}/api`,
        description: "Development server",
      },
      {
        url: "https://staging.example.com/api",
        description: "Staging server",
      },
      {
        url: "https://example.com/api",
        description: "Production server",
      },
    ],
  };
});

apiRoute.get(
  "/doc",
  async (c, next) => {
    if (c.env.ENVIRONMENT !== "production") {
      return next();
    }
    return c.text("API document is disabled in production", 403);
  },
  basicAuth({ username: "admin", password: "123456" }),
  Scalar({
    url: `/api/${docPath}`,
    pageTitle: "Hono API Document",
  })
);

apiRoute.get("/", (c) =>
  c.json(response.successWithData({ name: "Template Project" }))
);
