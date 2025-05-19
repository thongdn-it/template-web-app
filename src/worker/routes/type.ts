import { Schema } from "hono";
import { OpenAPIHono } from "@hono/zod-openapi";

interface APIEnv {
  Bindings: Env;
}

export class APIOpenAPIHono extends OpenAPIHono<APIEnv, Schema, "/"> {}
