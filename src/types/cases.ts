interface CreateCaseDto {
    name: string;
    breedId: number;
    ageMonths: number;
    ageYears: number;
    story: string;
    castrated: boolean;
    observations: string | null;
    rescuerId: number; // debería sacarlo del token?
    photos: File[];
    vaccines: [];
}

export { CreateCaseDto };
