import { hashPassword } from "../libs/security";
import { env } from "../infra/env";
import { prisma } from "../prisma/client";
import { UpdateProfileDto, CreateUserDTO } from "../types/users";
import { users } from "@prisma/client";

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
        if (dto.photo) data["photo_url"] = dto.photo;

        const user = await prisma.users.update({
            where: { id },
            data,
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

function getUserById(id: number) {
    return prisma.users.findUnique({
        include: { roles: true },
        where: { id },
    });
}

export { createUser, updateProfile, getUserByEmail, getUserById };
