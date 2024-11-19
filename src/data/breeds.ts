import type { breeds } from "@prisma/client";
import { prisma } from "../prisma/client";

function getAllBreeds(): Promise<breeds[]> {
    return prisma.breeds.findMany();
}

export { getAllBreeds };
