import { Hono } from "hono";
import {
    addPhotoToCase,
    createCase,
    getAllCases,
    getCaseDetail,
} from "../data/cases";
import { CreateCaseDto } from "../types/cases";
import type { users } from "@prisma/client";

const casesRouter = new Hono<{
    Variables: { user: users };
    Params: { id: string };
}>();

casesRouter.get("/", async (c) => {
    const cases = await getAllCases();
    return c.json(cases, 200);
});

casesRouter.post("/", async (c) => {
    const { id } = c.get("user");
    const payload = await c.req.json<CreateCaseDto>();
    console.log("Create case payload => ", payload);
    const createdCase = await createCase({
        ...payload,
        rescuerId: Number(id),
    });
    return c.json(createdCase, 200);
});

casesRouter.post("/:id/photos", async (c) => {
    const { id } = c.req.param();
    const files = (await c.req.formData()).get("photos");
    await addPhotoToCase(+id, files as unknown as File[]);
    return c.json(files, 200);
});

casesRouter.get("/:id", async (c) => {
    const { id } = c.req.param();
    const caseDetail = await getCaseDetail(+id);
    return c.json(caseDetail, 200);
});

export { casesRouter };
