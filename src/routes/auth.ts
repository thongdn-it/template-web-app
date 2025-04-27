import { createRoute } from "@hono/zod-openapi";

import { response } from "../utils";
import { APIOpenAPIHono } from "./type";
import { AuthResponse } from "../types";
import { requestSchema, responseSchema } from "../schemas";

const loginEmailRoute = createRoute({
  method: "post",
  path: "/login",
  tags: ["Auth"],
  description: "Login Email/Password",
  request: {
    body: {
      content: {
        "application/json": {
          schema: requestSchema.login,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: responseSchema.auth,
        },
      },
      description: "Retrieve the user",
    },
    400: {
      content: {
        "application/json": {
          schema: responseSchema.error,
        },
      },
      description: "Returns an error",
    },
  },
});

export const createAuthRoute = (app: APIOpenAPIHono) => {
  app.openapi(loginEmailRoute, (c) => {
    const validatedBody = c.req.valid("json");

    return response.success<AuthResponse>(c, {
      accessToken: "accessToken",
      refreshToken: "refreshToken",
      user: {
        id: "userId",
        email: validatedBody.email,
        fullName: "Thong Dang",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true,
        isVerified: true,
      },
    });
  });
};
