import { RootResolver } from "@hono/graphql-server";
import { getUserById } from "../data/users";

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
    };
};

export { rootResolver };
