import { Hono } from "hono";
import { getAllBreeds } from "../data/breeds";

const breedsRouter = new Hono();

breedsRouter.get("/", async (c) => {
    const breeds = await getAllBreeds();
    return c.json(breeds, 200);
});

export { breedsRouter };
