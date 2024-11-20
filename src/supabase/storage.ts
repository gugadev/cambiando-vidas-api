import { nanoid } from "nanoid";
import { supabase } from "./client";

type UploadedFile = {
    id: string;
    path: string;
    fullPath: string;
};

const uploadImageToSupabase = async (
    bucket: string,
    file: File
): Promise<[Nullable<UploadedFile>, Nullable<Error>]> => {
    const [originalFilename, ext] = file.name.split(".");
    let newFilename = `${originalFilename}-${nanoid()}`;
    if (ext) {
        newFilename += `.${ext}`;
    } else {
        const newExt = file.type.split("/")[1];
        newFilename += `.${newExt}`;
    }
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(newFilename, file);
    return [data, error];
};

export { uploadImageToSupabase };
