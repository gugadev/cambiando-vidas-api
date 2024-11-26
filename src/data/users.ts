import { hashPassword } from "../libs/security";
import { env } from "../infra/env";
import { prisma } from "../prisma/client";
import { UpdateProfileDto, CreateUserDTO } from "../types/users";
import { users } from "@prisma/client";
import { uploadImageToSupabase } from "../supabase/storage";

type UserIncludeFields = {
    roles?: boolean;
    cases?: boolean;
};

async function createUser(
    dto: CreateUserDTO
): Promise<[Nullable<users>, Nullable<Error>]> {
    try {
        const user = await prisma.users.create({
            data: {
                name: dto.name,
                email: dto.email,
                ruc: dto.ruc,
                is_organization: dto.isOrganization ?? false,
                role_id: dto.role,
                password: hashPassword(dto.password),
                photo_url: `${env.supabaseProfileImagesBucket}/default-avatar.jpg?t=2024-10-22T02%3A24%3A28.852Z`,
            },
        });
        return [user, null];
    } catch (err) {
        return [null, err as Error];
    }
}

async function updateProfile(
    dto: UpdateProfileDto,
    id: number
): Promise<[Nullable<users>, Nullable<Error>]> {
    try {
        // we'll use only the fields that have data
        const data: Record<string, unknown> = {};
        if (dto.phone) data["phone"] = dto.phone;
        if (dto.email) data["email"] = dto.email;
        if (dto.about) data["about"] = dto.about;
        if (dto.password) data["password"] = hashPassword(dto.password);

        const user = await prisma.users.update({
            where: { id },
            data,
        });
        return [user, null];
    } catch (err) {
        return [null, err as Error];
    }
}

async function updateProfilePhoto(
    photo: File,
    id: number
): Promise<[Nullable<users>, Nullable<Error>] | [null, string]> {
    try {
        const [uploadedPhoto, err] = await uploadImageToSupabase(
            env.supabaseProfileImagesBucket,
            photo as File
        );
        if (err) {
            return [null, "Ocurrió un error al actualizar la foto"];
        }
        const user = await prisma.users.update({
            where: { id },
            data: { photo_url: uploadedPhoto!.fullPath },
        });
        return [user, null];
    } catch (err) {
        return [null, err as Error];
    }
}

function getUserByEmail(email: string) {
    return prisma.users.findUnique({
        include: { roles: true },
        where: { email },
    });
}

function getUserById(id: number, include: UserIncludeFields = { roles: true }) {
    return prisma.users.findUnique({
        include,
        where: { id },
    });
}

export {
    createUser,
    updateProfile,
    updateProfilePhoto,
    getUserByEmail,
    getUserById,
};
