import { Hono } from "hono";
import { getUserById, updateProfile } from "../data/users";
import { users } from "@prisma/client";
import { UpdateProfileDto } from "../types/users";
import { uploadImageToSupabase } from "../supabase/storage";
import { env } from "../infra/env";

const usersRouter = new Hono<{ Variables: { user: users } }>();

usersRouter.get("/me", (c) => {
    const user = c.get("user");
    return c.json(user, 200);
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

usersRouter.put("/:id", async (c) => {
    const { id } = c.req.param();
    if (!id || Number.isNaN(id)) {
        return c.json({ message: "ID de usuario inválido" }, 400);
    }
    const body = await c.req.json<UpdateProfileDto>();
    const userFound = await getUserById(+id);
    if (!userFound) {
        return c.json(null, 404);
    }
    const updatedUser = await updateProfile(body, +id);
    return c.json(updatedUser, 200);
});

usersRouter.put("/:id/photo", async (c) => {
    const { id } = c.req.param();
    if (!id || Number.isNaN(id)) {
        return c.json({ message: "ID de usuario inválido" }, 400);
    }
    const formData = await c.req.formData();
    const photo = await formData.get("photo");
    if (!photo) {
        return c.json({ message: "No se encontró la foto" }, 400);
    }
    const userFound = await getUserById(+id);
    if (!userFound) {
        return c.json(null, 404);
    }
    const [uploadedPhoto, err] = await uploadImageToSupabase(
        env.supabaseProfileImagesBucket,
        photo as File
    );
    if (err) {
        return c.json(
            { message: "Ocurrió un error al actualizar la foto" },
            500
        );
    }
    const dto: UpdateProfileDto = {
        photo: uploadedPhoto!.fullPath,
        phone: null,
        about: null,
        email: null,
        password: null,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, updateErr] = await updateProfile(dto, +id);
    return c.json({ photoUrl: uploadedPhoto!.fullPath }, 200);
});

export { usersRouter };
