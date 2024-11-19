import { Hono } from "hono";
import { getUserById } from "../data/users";
import { users } from "@prisma/client";

const usersRouter = new Hono<{ Variables: { user: users } }>();

usersRouter.get("/me", (c) => {
    const user = c.get("user");
    return c.json(user, 200);
});

usersRouter.get("/:id", async (c) => {
    const { id } = c.req.param();
    const userFound = await getUserById(+id);
    if (!userFound) {
        return c.json(null, 404);
    }
    return c.json(userFound, 200);
});

export { usersRouter };
