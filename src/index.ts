import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { graphqlServer } from "@hono/graphql-server";
import { serve } from "@hono/node-server";
import { users } from "@prisma/client";
import {
    usersRouter,
    casesRouter,
    rolesRouter,
    breedsRouter,
    vaccinesRouter,
    authRouter,
} from "./routes";
import { schema, rootResolver } from "./graphql";
import { env } from "./infra/env";
import { allowedMiddleware } from "./middlewares/allowed";

// @ts-expect-error BigInt is not defined in the global scope
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

// Pass the generics to the Hono instance to type set / get
const app = new Hono<{ Variables: { user: users } }>();

console.log("Env Vars:", env);

app.use(logger());
app.use(allowedMiddleware);
app.use(
    "*",
    cors({
        origin: [
            "http://localhost:3000",
            "https://cambiandovidas.wooftrack.pe",
        ],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);
app.use(
    "/graphql",
    graphqlServer({
        schema,
        rootResolver,
        graphiql: true,
    })
);

app.get("/", (c) => {
    return c.text("Hmmm... Who are you?");
});
app.route("/api/v1/users", usersRouter);
app.route("/api/v1/cases", casesRouter);
app.route("/api/v1/roles", rolesRouter);
app.route("/api/v1/breeds", breedsRouter);
app.route("/api/v1/vaccines", vaccinesRouter);
app.route("/api/v1/auth", authRouter);

// export default app;
serve({
    fetch: app.fetch,
    port: 3001,
});
