import { RootResolver } from "@hono/graphql-server";

const rootResolver: RootResolver = (c) => {
    return {
        // TODO: Implement the resolvers for query and mutation
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        me: async (token: string): Promise<any> => {
            return c.get("user");
        },
    };
};

export { rootResolver };
