const environment = {
    database: process.env.DATABASE_URL,
    databaseDirect: process.env.DIRECT_URL,
    supabaseProject: process.env.SUPABASE_URL,
    supabaseApiKey: process.env.SUPABASE_ANON_KEY,
    supabaseProfileImagesBucket: process.env.SUPABASE_PROFILE_IMAGES_BUCKET,
    supabaseCasesImagesBucket: process.env.SUPABASE_CASES_IMAGES_BUCKET,
    tokenSecret: process.env.TOKEN_SECRET,
};

export { environment };
