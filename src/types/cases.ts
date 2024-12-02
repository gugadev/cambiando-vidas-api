interface CreateCaseDto {
    name: string;
    breedId: number;
    ageMonths: number;
    ageYears: number;
    story: string;
    castrated: boolean;
    observations: string | null;
    vaccines: [];
    noBreed?: boolean;
}

export { CreateCaseDto };
