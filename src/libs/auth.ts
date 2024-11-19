import { z, ZodSchema } from "zod";
import { transformZodErrors } from "./forms";

function validateSchema(schema: ZodSchema, dto: unknown) {
    try {
        schema.parse(dto);
        return null;
    } catch (err) {
        transformZodErrors(err as z.ZodError);
    }
}

export { validateSchema };
