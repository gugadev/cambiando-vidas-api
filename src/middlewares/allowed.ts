import { createMiddleware } from "hono/factory";
import { getApiKey } from "../data/api_keys";

const allowedMiddleware = createMiddleware(async (c, next) => {
    const apikey = c.req.header("X-Api-Key");
    const apiKeyExists = await getApiKey(apikey ?? "");
    if (!apikey || !apiKeyExists) {
        return c.text("Unauthorized", 401);
    }
    await next();
});

export { allowedMiddleware };
