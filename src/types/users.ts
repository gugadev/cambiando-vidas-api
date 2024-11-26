interface CreateUserDTO {
    name: string;
    ruc: string | null;
    email: string;
    password: string;
    isOrganization: boolean;
    role: number;
}

interface UpdateProfileDto {
    phone: string;
    email: string;
    password?: string;
    about: string | null;
}

export type { CreateUserDTO, UpdateProfileDto };
