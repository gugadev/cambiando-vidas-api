import { prisma } from "../prisma/client";

const getAllRoles = () => {
    return prisma.roles.findMany({
        where: {
            name: {
                not: "admin",
            },
        },
    });
};

const getRoleById = (id: number) => {
    return prisma.roles.findFirst({
        where: {
            id: id,
        },
    });
};

export { getAllRoles, getRoleById };
