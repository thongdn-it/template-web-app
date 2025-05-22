import { createRoute } from "@hono/zod-openapi";

import { response } from "../utils";
import { UserModel } from "../models";
import { ERRORS } from "../constants";
import { APIOpenAPIHono } from "./type";
import { DBUserModel } from "../db/models";
import { requestSchema, responseSchema } from "../schemas";
import { authMiddleware, kvCacheMiddleware } from "../middlewares";

const getMeRoute = createRoute({
  path: "/user/me",
  method: "get",
  tags: ["User"],
  middleware: [authMiddleware],
  responses: {
    200: {
      description: "Retrieve the user",
      content: {
        "application/json": {
          schema: responseSchema.user,
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
  },
});

const searchUserRoute = createRoute({
  path: "/user/search",
  method: "get",
  tags: ["User"],
  middleware: [authMiddleware, kvCacheMiddleware(10)],
  request: {
    query: requestSchema.search,
  },
  responses: {
    200: {
      description: "Retrieve the users",
      content: {
        "application/json": {
          schema: responseSchema.users,
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

export const createUserRoute = (app: APIOpenAPIHono) => {
  app.openapi(getMeRoute, async (c) => {
    console.log("Get Me Route");
    const jwtPayload = c.get("jwtPayload");
    if (jwtPayload) {
      const userId = jwtPayload.sub;
      const result = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?")
        .bind(userId)
        .first();
      if (result) {
        const user = result as DBUserModel;
        return c.json(response.successWithData(new UserModel(user)), 200);
      }
    }
    return c.json(
      response.error(ERRORS.USER_NOT_FOUND.code, {
        message: ERRORS.USER_NOT_FOUND.message,
      }),
      404
    );
  });

  app.openapi(searchUserRoute, async (c) => {
    const { q, page, limit } = c.req.valid("query");

    try {
      const offset = (page - 1) * limit;
      const keyword = `%${q}%`;

      const result = await c.env.DB.prepare(
        `SELECT *, COUNT(*) OVER() as total_count 
       FROM users
       WHERE email LIKE ? 
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`
      )
        .bind(keyword, limit, offset)
        .all();

      const users = result.results as (DBUserModel & { total_count: number })[];
      let total = users[0]?.total_count || 0;

      if (total === 0 && page > 1) {
        const totalResult = await c.env.DB.prepare(
          `SELECT COUNT(*) as total_count FROM users WHERE email LIKE ?`
        )
          .bind(keyword)
          .first();
        total = totalResult
          ? (totalResult as { total_count: number }).total_count
          : 0;
      }

      return c.json(
        response.successWithPagination(
          users.map((u) => new UserModel(u)),
          total,
          page,
          limit,
          { message: "Users retrieved successfully" }
        ),
        200
      );
    } catch (error) {
      return c.json(
        response.error(ERRORS.DATABASE_ERROR.code, {
          message: ERRORS.DATABASE_ERROR.message,
          data: (error as Error).message,
        }),
        500
      );
    }
  });
};
