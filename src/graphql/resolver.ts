import { RootResolver } from "@hono/graphql-server";
import { getUserById } from "../data/users";
import { getAllBreeds } from "../data/breeds";
import { getAllCases, getCaseDetail } from "../data/cases";
import { getAllRoles } from "../data/roles";
import { getAllVaccines } from "../data/vaccines";

const rootResolver: RootResolver = (c) => {
    return {
        me: async () => {
            const user = c.get("user");
            console.log("user", user);
            return user;
        },
        getUserById: async ({ id }: { id: number }) => {
            console.log("id => ", id);
            const user = await getUserById(id);
            console.log("user => ", JSON.stringify(user));
            return JSON.parse(JSON.stringify(user));
        },
        cases: async () => {
            const cases = await getAllCases();
            return JSON.parse(JSON.stringify(cases));
        },
        getCaseById: async ({ id }: { id: number }) => {
            const caseDetail = await getCaseDetail(id);
            return JSON.parse(JSON.stringify(caseDetail));
        },
        roles: async () => {
            const roles = await getAllRoles();
            return JSON.parse(JSON.stringify(roles));
        },
        breeds: async () => {
            const breeds = await getAllBreeds();
            return JSON.parse(JSON.stringify(breeds));
        },
        vaccines: async () => {
            const vaccines = await getAllVaccines();
            return JSON.parse(JSON.stringify(vaccines));
        },
    };
};

export { rootResolver };
