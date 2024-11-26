import { createMiddleware } from "hono/factory";
import { checkToken, decodeToken } from "../libs/security";

const authMiddleware = createMiddleware(async (c, next) => {
    const token = c.req.header("Authorization");
    if (!token) {
        return c.text("Unauthorized", 401);
    }
    const isTokenValid = await checkToken(token);
    if (!isTokenValid) {
        return c.text("Unauthorized: token expired or malformed", 401);
    }
    const user = await decodeToken(token);
    c.set("user", user);
    await next();
});

export { authMiddleware };
