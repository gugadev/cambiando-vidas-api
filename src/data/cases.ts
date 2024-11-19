import { environment } from "../infra/environment";
import { uploadImageToSupabase } from "../supabase/storage";
import { prisma } from "../prisma/client";
import { CreateCaseDto } from "../types/cases";
import { cases } from "@prisma/client";

const getAllCases = () => {
    return prisma.cases.findMany({
        include: {
            cases_photos: true,
            breeds: true,
            rescuer: true,
        },
    });
};

const getCaseDetail = (id: number) => {
    return prisma.cases.findUnique({
        where: {
            id,
        },
        include: {
            cases_photos: true,
            breeds: true,
            rescuer: true,
        },
    });
};

const createCase = async (
    data: CreateCaseDto
): Promise<[Nullable<cases>, Nullable<Error>]> => {
    try {
        // 1. Register the case in the database
        const newCase = await prisma.cases.create({
            data: {
                name: data.name,
                breed_id: data.breedId,
                age_months: data.ageMonths,
                age_years: data.ageYears,
                about: data.story,
                observations: data.observations,
                castrated: data.castrated,
                rescuer_id: data.rescuerId,
                vaccines: data.vaccines,
                status: "PENDING",
            },
        });
        // 2. Upload the photos to the cloud (supabase)
        for (const photo of data.photos) {
            const [uploadedPhoto, error] = await uploadImageToSupabase(
                environment.supabaseCasesImagesBucket,
                photo
            );
            if (error) {
                throw new Error(error.message);
            }
            await prisma.cases_photos.create({
                data: {
                    case_id: newCase.id,
                    photo_url: uploadedPhoto!.fullPath,
                },
            });
        }
        const createdCase = await prisma.cases.findUnique({
            where: {
                id: newCase.id,
            },
            include: {
                breeds: true,
                rescuer: true,
                cases_photos: true,
            },
        });
        return [createdCase, null];
    } catch (error) {
        return [null, error as Error];
    }
};

export { createCase, getCaseDetail, getAllCases };
