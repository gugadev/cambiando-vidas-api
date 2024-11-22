import { Hono } from "hono";
import { getRoleById } from "../data/roles";
import { createUser, getUserByEmail } from "../data/users";
import { CreateUserDTO } from "../types/users";
import { checkToken, comparePasswords, createToken } from "../libs/security";

interface LoginBody {
    email: string;
    password: string;
}

type SignupBody = CreateUserDTO;

const authRouter = new Hono<{
    Body: LoginBody | SignupBody;
    Variables: never;
}>();

authRouter.post("/login", async (c) => {
    const { email, password } = await c.req.json<LoginBody>();
    const user = await getUserByEmail(email);
    const match = user ? comparePasswords(password, user.password) : false;
    if (!user || match) {
        return c.json({ error: "Usuario o contraseña incorrectas" }, 400);
    }
    const token = await createToken(user);
    return c.json({ accessToken: token }, 200);
});

authRouter.post("/signup", async (c) => {
    const signupBody = await c.req.json<SignupBody>();
    const role = await getRoleById(signupBody.role);
    if (signupBody.role === 1) {
        return c.json(
            { error: "No puedes registrarte como administrador" },
            400
        );
    }
    if (!role) {
        return c.json({ error: "El rol proporcionado no existe" }, 400);
    }
    const [user, err] = await createUser(signupBody);
    if (err) {
        console.log("Error creating user => ", err);
        return c.json({ error: "No se pudo crear el usuario" }, 400);
    }
    const accessToken = await createToken(user!);
    console.log("Created user => ", user);
    console.log("Access token => ", accessToken);
    return c.json({ user, accessToken }, 200);
});

authRouter.post("/token/validate", async (c) => {
    const token = c.req.header("Authorization");
    if (!token) {
        return c.json({ error: "Token no proporcionado" }, 400);
    }
    const isValid = await checkToken(token);
    if (!isValid) {
        return c.json({ error: "Token inválido" }, 401);
    }
    return c.json(true, 200);
});

export { authRouter };
