import { basicAuth } from "hono/basic-auth";
import { Scalar } from "@scalar/hono-api-reference";

import { APIOpenAPIHono } from "./type";
import { randomString } from "../utils";

export const apiRoute = new APIOpenAPIHono();

// - Swagger UI - //
const docPath = `doc-${randomString()}`;
apiRoute.doc(`/${docPath}`, {
  info: {
    title: "Hono API Documentation",
    version: "v1",
  },
  openapi: "3.1.0",
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
    servers: [
      {
        url: "http://localhost:23600/api",
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
  })
);
