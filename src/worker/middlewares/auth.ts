import { MiddlewareHandler } from "hono";

import { ERRORS } from "../constants";
import { JWTUtils, response } from "../utils";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (token) {
    try {
      const result = await JWTUtils.verify(token, c.env.JWT_SECRET);
      if (result && result.type === "access") {
        c.set("jwtPayload", result);
        await next();
      }
    } catch (error) {
      console.error("JWT verification error:", error);
    }
  }
  return c.json(
    response.error(ERRORS.UNAUTHORIZED.code, {
      message: ERRORS.UNAUTHORIZED.message,
    }),
    401
  );
};
