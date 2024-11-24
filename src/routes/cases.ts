import { Hono } from "hono";
import {
    addPhotoToCase,
    createCase,
    getAllCases,
    getCaseDetail,
} from "../data/cases";
import { CreateCaseDto } from "../types/cases";
import type { users } from "@prisma/client";
import { authMiddleware } from "../middlewares/auth";

const casesRouter = new Hono<{
    Variables: { user: users };
    Params: { id: string };
}>();

casesRouter.get("/", async (c) => {
    const cases = await getAllCases();
    return c.json(cases, 200);
});

casesRouter.post("/", authMiddleware, async (c) => {
    const { id } = c.get("user");
    const payload = await c.req.json<CreateCaseDto>();
    console.log("Create case payload => ", payload);
    const createdCase = await createCase({
        ...payload,
        rescuerId: Number(id),
    });
    return c.json(createdCase, 200);
});

casesRouter.post("/:id/photos", authMiddleware, async (c) => {
    const { id } = c.req.param();
    if (!id || Number.isNaN(+id)) {
        return c.json({ message: "ID de caso inválido" }, 400);
    }
    const caseFound = await getCaseDetail(+id);
    if (!caseFound) {
        return c.json({ message: "Caso no encontrado" }, 404);
    }
    // Validate if the user is the rescuer of the case
    if (Number(c.get("user").id) !== Number(caseFound.rescuer_id)) {
        return c.json(
            { message: "No tienes permisos para subir fotos a este caso" },
            403
        );
    }
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
