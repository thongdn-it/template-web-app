import { createRoute } from "@hono/zod-openapi";

import { ERRORS } from "../constants";
import { UserModel } from "../models";
import { APIOpenAPIHono } from "./type";
import { DBUserModel } from "../db/models";
import { HashUtils, JWTUtils, response } from "../utils";
import { requestSchema, responseSchema } from "../schemas";

const registerEmailRoute = createRoute({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: requestSchema.register,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Retrieve the user",
      content: {
        "application/json": {
          schema: responseSchema.auth,
        },
      },
    },
    400: {
      description: "Invalid request body",
      content: {
        "application/json": {
          schema: responseSchema.error,
        },
      },
    },
    409: {
      description: "Email already exists",
      content: {
        "application/json": {
          schema: responseSchema.error,
        },
      },
    },
    500: {
      description: "Returns an error",
      content: {
        "application/json": {
          schema: responseSchema.error,
        },
      },
    },
  },
});

const loginEmailRoute = createRoute({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: requestSchema.login,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Retrieve the user",
      content: {
        "application/json": {
          schema: responseSchema.auth,
        },
      },
    },
    400: {
      description: "Invalid request body",
      content: {
        "application/json": {
          schema: responseSchema.error,
        },
      },
    },
    401: {
      description: "Invalid credentials",
      content: {
        "application/json": {
          schema: responseSchema.error,
        },
      },
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: responseSchema.error,
        },
      },
    },
    500: {
      description: "Returns an error",
      content: {
        "application/json": {
          schema: responseSchema.error,
        },
      },
    },
  },
});

const refreshTokenRoute = createRoute({
  method: "post",
  path: "/auth/refresh-token",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: requestSchema.refreshToken,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Retrieve the user",
      content: {
        "application/json": {
          schema: responseSchema.refreshToken,
        },
      },
    },
    400: {
      description: "Invalid request body",
      content: {
        "application/json": {
          schema: responseSchema.error,
        },
      },
    },
    401: {
      description: "Invalid refresh token",
      content: {
        "application/json": {
          schema: responseSchema.error,
        },
      },
    },
  },
});

export const createAuthRoute = (app: APIOpenAPIHono) => {
  app.openapi(registerEmailRoute, async (c) => {
    const validatedBody = c.req.valid("json");
    if (!validatedBody) {
      return c.json(
        response.error(ERRORS.BAD_REQUEST.code, {
          message: ERRORS.BAD_REQUEST.message,
        }),
        400
      );
    }
    const { email, password } = validatedBody;

    try {
      const passwordHash = await HashUtils.hashPassword(password);
      const id = crypto.randomUUID();

      const result = await c.env.DB.prepare(
        `INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)`
      )
        .bind(id, email, passwordHash)
        .run();
      if (result.success) {
        const { accessToken, refreshToken } = await JWTUtils.createTokens(
          {
            email,
            id,
          },
          c.env.JWT_SECRET
        );

        return c.json(
          response.successWithData({
            access_token: accessToken,
            refresh_token: refreshToken,
            user: new UserModel({
              id,
              email,
              password_hash: "",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_active: 1,
              is_verified: 0,
            }),
          }),
          200
        );
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("SQLITE_CONSTRAINT")) {
        return c.json(
          response.error(ERRORS.EMAIL_EXISTS.code, {
            message: ERRORS.EMAIL_EXISTS.message,
          }),
          409
        );
      }
      return c.json(
        response.error(ERRORS.DATABASE_ERROR.code, {
          message: ERRORS.DATABASE_ERROR.message,
          data: errorMessage,
        }),
        500
      );
    }
    return c.json(
      response.error(ERRORS.UNKNOWN.code, {
        message: ERRORS.UNKNOWN.message,
      }),
      500
    );
  });

  app.openapi(loginEmailRoute, async (c) => {
    const validatedBody = c.req.valid("json");
    if (!validatedBody) {
      return c.json(
        response.error(ERRORS.BAD_REQUEST.code, {
          message: ERRORS.BAD_REQUEST.message,
        }),
        400
      );
    }
    const { email, password } = validatedBody;
    try {
      const result = await c.env.DB.prepare(
        `SELECT * FROM users WHERE email = ?`
      )
        .bind(email)
        .first();

      if (!result) {
        return c.json(
          response.error(ERRORS.USER_NOT_FOUND.code, {
            message: ERRORS.USER_NOT_FOUND.message,
          }),
          404
        );
      }
      const user = result as DBUserModel;
      const isPasswordValid = await HashUtils.comparePassword(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        return c.json(
          response.error(ERRORS.INVALID_CREDENTIALS.code, {
            message: ERRORS.INVALID_CREDENTIALS.message,
          }),
          401
        );
      }

      const { accessToken, refreshToken } = await JWTUtils.createTokens(
        {
          email,
          id: user.id,
        },
        c.env.JWT_SECRET
      );

      return c.json(
        response.successWithData({
          access_token: accessToken,
          refresh_token: refreshToken,
          user: new UserModel(user),
        }),
        200
      );
    } catch (error) {
      const errorMessage = (error as Error).message;
      return c.json(
        response.error(ERRORS.DATABASE_ERROR.code, {
          message: ERRORS.DATABASE_ERROR.message,
          data: errorMessage,
        }),
        500
      );
    }
  });

  app.openapi(refreshTokenRoute, async (c) => {
    const validatedBody = c.req.valid("json");
    if (!validatedBody) {
      return c.json(
        response.error(ERRORS.BAD_REQUEST.code, {
          message: ERRORS.BAD_REQUEST.message,
        }),
        400
      );
    }
    const { refresh_token } = validatedBody;
    try {
      const payload = await JWTUtils.verify(refresh_token, c.env.JWT_SECRET);
      if (payload) {
        const { email, sub: id } = payload as { email: string; sub: string };
        const { accessToken, refreshToken } = await JWTUtils.createTokens(
          {
            email,
            id,
          },
          c.env.JWT_SECRET
        );

        return c.json(
          response.successWithData({
            access_token: accessToken,
            refresh_token: refreshToken,
          }),
          200
        );
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("JWT verification error:", errorMessage);
    }
    return c.json(
      response.error(ERRORS.INVALID_REFRESH_TOKEN.code, {
        message: ERRORS.INVALID_REFRESH_TOKEN.message,
      }),
      401
    );
  });
};
