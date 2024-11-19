import { createClient } from "@supabase/supabase-js";
import { environment } from "../infra/environment";

const supabase = createClient(
    environment.supabaseProject,
    environment.supabaseApiKey,
);

export { supabase };
