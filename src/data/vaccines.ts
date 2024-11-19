import { prisma } from "../prisma/client";

const getAllVaccines = () => {
    return prisma.vaccines.findMany();
};

export { getAllVaccines };
