interface CreateUserDTO {
    name: string;
    ruc: string | null;
    email: string;
    password: string;
    isOrganization: boolean;
    role: number;
}

interface UpdateProfileDto {
    phone: string | null;
    email: string | null;
    password: string | null;
    about: string | null;
    photo: string | null;
}

export type { CreateUserDTO, UpdateProfileDto };
