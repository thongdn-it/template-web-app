import { OpenAPIHono } from "@hono/zod-openapi";

type APIEnv = {
  Bindings: {
    ENVIRONMENT: string;
  };
  Variables: {};
};

export class APIOpenAPIHono extends OpenAPIHono<APIEnv, {}, "/"> {}
