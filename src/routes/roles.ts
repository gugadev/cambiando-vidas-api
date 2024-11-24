import { Hono } from "hono";
import { getAllRoles } from "../data/roles";

const rolesRouter = new Hono();

rolesRouter.get("/", async (c) => {
    const roles = await getAllRoles();
    const fileredRoles = roles.filter((role) => role.name !== "Administrador");
    return c.json(fileredRoles, 200);
});

export { rolesRouter };
