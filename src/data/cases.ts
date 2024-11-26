import { env } from "../infra/env";
import { uploadImageToSupabase } from "../supabase/storage";
import { prisma } from "../prisma/client";
import { CreateCaseDto } from "../types/cases";
import { cases } from "@prisma/client";

function getAllCases() {
    return prisma.cases.findMany({
        include: {
            cases_photos: true,
            breeds: true,
            rescuer: true,
        },
    });
}

function getCaseDetail(id: number) {
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
}

async function createCase(
    data: CreateCaseDto & { rescuerId: number }
): Promise<[Nullable<cases>, Nullable<Error>]> {
    const NO_BREED_ID = 41;
    try {
        const newCase = await prisma.cases.create({
            data: {
                name: data.name,
                breed_id: data.noBreed ? NO_BREED_ID : data.breedId,
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
}

async function addPhotoToCase(caseId: number, photos: File[]) {
    for (const photo of photos) {
        const [uploadedPhoto, error] = await uploadImageToSupabase(
            env.supabaseCasesImagesBucket,
            photo
        );
        if (error) {
            throw new Error(error.message);
        }
        await prisma.cases_photos.create({
            data: {
                case_id: caseId,
                photo_url: uploadedPhoto!.fullPath,
            },
        });
    }
}

export { createCase, getCaseDetail, getAllCases, addPhotoToCase };
