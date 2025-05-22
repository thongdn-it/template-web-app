import { Hono } from "hono";

import { cors } from "hono/cors";
import { cache } from "hono/cache";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import { createAppRoute } from "./routes";

const app = new Hono();

app.use(cors(), logger(), prettyJSON());
app.get(
  "*",
  cache({
    cacheName: "template-project",
    cacheControl: "max-age=60", // 1 minute
  })
);

createAppRoute(app);

export default app;
