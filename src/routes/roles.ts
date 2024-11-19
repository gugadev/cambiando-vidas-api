import { Hono } from "hono";
import { getAllRoles } from "../data/roles";

const rolesRouter = new Hono();

rolesRouter.get("/", async (c) => {
    const roles = await getAllRoles();
    return c.json(roles, 200);
});

export { rolesRouter };
