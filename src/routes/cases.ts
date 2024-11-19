import { Hono } from "hono";
import { getAllCases, getCaseDetail } from "../data/cases";

const casesRouter = new Hono();

casesRouter.get("/", async (c) => {
    const cases = await getAllCases();
    return c.json(cases, 200);
});

casesRouter.get("/:id", async (c) => {
    const { id } = c.req.param();
    const caseDetail = await getCaseDetail(+id);
    return c.json(caseDetail, 200);
});

export { casesRouter };
