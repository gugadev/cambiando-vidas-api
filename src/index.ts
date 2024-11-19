import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { graphqlServer } from "@hono/graphql-server";
import { users } from "@prisma/client";
import {
    usersRouter,
    casesRouter,
    rolesRouter,
    breedsRouter,
    vaccinesRouter,
} from "./routes";
import { authMiddleware } from "./middlewares/auth";
import { schema, rootResolver } from "./graphql";

// Pass the generics to the Hono instance to type set / get
const app = new Hono<{ Variables: { user: users } }>();
const users = usersRouter;
const cases = casesRouter;
const roles = rolesRouter;
const breeds = breedsRouter;
const vaccines = vaccinesRouter;

app.use(logger());
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
app.use(authMiddleware);

app.get("/", (c) => {
    return c.text("Hmmm... Who are you?");
});
app.route("/users", users);
app.route("/cases", cases);
app.route("/roles", roles);
app.route("/breeds", breeds);
app.route("/vaccines", vaccines);

export default app;
