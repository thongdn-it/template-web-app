import { Hono } from "hono";

import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import { renderer } from "./renderer";
import { createAppRoute } from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = new Hono();

app.use(renderer);
app.use(logger());
app.use(prettyJSON());
app.use(cors());
app.use(errorHandler());

createAppRoute(app);

export default app;
