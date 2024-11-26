import { Hono } from "hono";
import { getUserById, updateProfile, updateProfilePhoto } from "../data/users";
import { users } from "@prisma/client";
import { UpdateProfileDto } from "../types/users";
import { authMiddleware } from "../middlewares/auth";

const usersRouter = new Hono<{ Variables: { user: users } }>();

usersRouter.get("/me", authMiddleware, async (c) => {
    const user = c.get("user");
    const userWithIncludedFields = await getUserById(Number(user.id));
    return c.json(userWithIncludedFields, 200);
});

usersRouter.get("/:id", async (c) => {
    const { id } = c.req.param();
    if (!id || Number.isNaN(id)) {
        return c.json({ message: "ID de usuario inválido" }, 400);
    }
    const userFound = await getUserById(+id);
    if (!userFound) {
        return c.json(null, 404);
    }
    return c.json(userFound, 200);
});

usersRouter.put("/:id", authMiddleware, async (c) => {
    const { id } = c.req.param();
    if (!id || Number.isNaN(id)) {
        return c.json({ message: "ID de usuario inválido" }, 400);
    }
    // Validate if the user is updating its own profile
    if (Number(c.get("user").id) !== +id) {
        return c.json(
            { message: "No tienes permisos para actualizar la foto" },
            403
        );
    }
    const body = await c.req.json<UpdateProfileDto>();
    const userFound = await getUserById(+id);
    if (!userFound) {
        return c.json(null, 404);
    }
    const [updatedUser, updateErr] = await updateProfile(body, +id);
    if (updateErr) {
        return c.json(
            { message: "Ocurrió un error al actualizar el perfil" },
            500
        );
    }
    return c.json(updatedUser, 200);
});

usersRouter.put("/:id/photo", authMiddleware, async (c) => {
    const { id } = c.req.param();
    if (!id || Number.isNaN(id)) {
        return c.json({ message: "ID de usuario inválido" }, 400);
    }
    // Validate if the user is updating its own profile
    if (Number(c.get("user").id) !== +id) {
        return c.json(
            { message: "No tienes permisos para actualizar la foto" },
            403
        );
    }
    const formData = await c.req.formData();
    const photo = formData.get("photo");
    // Validate if the photo exists
    if (!photo) {
        return c.json({ message: "No se encontró la foto" }, 400);
    }
    const userFound = await getUserById(+id);
    // Validate if the user exists
    if (!userFound) {
        return c.json(null, 404);
    }
    const [user, updateErr] = await updateProfilePhoto(photo as File, +id);
    // Validate if there was an error updating the photo
    if (updateErr) {
        c.json({ message: "Ocurrió un error al actualizar la foto" }, 500);
    }
    return c.json({ photoUrl: user!.photo_url }, 200);
});

export { usersRouter };
