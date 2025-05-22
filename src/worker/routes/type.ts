import { Schema } from "hono";
import { OpenAPIHono } from "@hono/zod-openapi";
import { JWTPayload } from "hono/utils/jwt/types";

interface APIEnv {
  Bindings: Env;
  Variables: {
    jwtPayload: JWTPayload;
  };
}

export class APIOpenAPIHono extends OpenAPIHono<APIEnv, Schema, "/"> {}
