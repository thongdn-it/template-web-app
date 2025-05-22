import { MiddlewareHandler } from "hono";
import { JWTPayload } from "hono/utils/jwt/types";

export const kvCacheMiddleware = (
  ttlSeconds: number = 60
): MiddlewareHandler => {
  return async (c, next) => {
    const request = c.req;
    if (request.method !== "GET") {
      return await next();
    }

    const jwtPayload: JWTPayload = c.get("jwtPayload");
    const cacheKey = `kv-cache:${request.url}:${jwtPayload.sub}`;
    const cacheValue = await c.env.KV.get(cacheKey);
    if (cacheValue) {
      return c.json(JSON.parse(cacheValue));
    }

    await next();

    if (c.res && c.res.status === 200) {
      const resClone = c.res.clone();
      const resText = await resClone.text();
      await c.env.KV.put(cacheKey, resText, {
        expirationTtl: ttlSeconds >= 60 ? ttlSeconds : 60,
      });

      return new Response(resText, {
        status: c.res.status,
        headers: c.res.headers,
      });
    }
  };
};
