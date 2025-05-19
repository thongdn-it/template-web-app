import { Hono } from "hono";

import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import { createAppRoute } from "./routes";

const app = new Hono();

app.use(cors(), logger(), prettyJSON());

createAppRoute(app);

export default app;
