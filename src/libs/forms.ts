import { z } from "zod";

type TransformedZodError = {
    path: string;
    message: string;
};

const transformZodErrors = (error: z.ZodError): Array<TransformedZodError> => {
    return error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
    }));
};

export { transformZodErrors, type TransformedZodError };
