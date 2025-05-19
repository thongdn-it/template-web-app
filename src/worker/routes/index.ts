import { Hono } from "hono";

import { apiRoute } from "./api";
import { createAuthRoute } from "./auth";

export const createAppRoute = (app: Hono) => {
  createAuthRoute(apiRoute);

  app.route("/api", apiRoute);
};
