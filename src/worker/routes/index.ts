import { Hono } from "hono";

import { apiRoute } from "./api";
import { createAuthRoute } from "./auth";
import { createUserRoute } from "./user";

export const createAppRoute = (app: Hono) => {
  createAuthRoute(apiRoute);
  createUserRoute(apiRoute);

  app.route("/api", apiRoute);
};
