import { createMiddleware } from "hono/factory";
import { checkToken, decodeToken } from "../libs/security";
import { getApiKey } from "../data/api_keys";

const authMiddleware = createMiddleware(async (c, next) => {
    const apikey = c.req.header("X-Api-Key");
    const apiKeyExists = getApiKey(apikey ?? "");
    if (!apikey || !apiKeyExists) {
        return c.text("Unauthorized", 401);
    }
    if (
        c.req.path === "/api/v1/auth/login" ||
        c.req.path === "/api/v1/auth/signup" ||
        c.req.path === "/graphql"
    ) {
        return await next();
    }
    const token = c.req.header("Authorization");
    if (!token) {
        return c.text("Unauthorized", 401);
    }
    const isTokenValid = await checkToken(token);
    if (!isTokenValid) {
        return c.text("Unauthorized", 401);
    }
    const user = await decodeToken(token);
    c.set("user", user);
    await next();
});

export { authMiddleware };
