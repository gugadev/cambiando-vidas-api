import { Hono } from "hono";
import { getAllVaccines } from "../data/vaccines";

const vaccinesRouter = new Hono();

vaccinesRouter.get("/", async (c) => {
    const vaccines = await getAllVaccines();
    return c.json(vaccines, 200);
});

export { vaccinesRouter };
