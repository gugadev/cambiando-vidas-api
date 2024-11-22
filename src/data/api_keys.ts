import { prisma } from "../prisma/client";

async function getWebApiKey() {
    const record = await prisma.api_keys.findUnique({
        where: {
            client_type: "web",
            client_name: "Wooftrack",
        },
    });
    return record?.api_key;
}

async function getMobileApiKey() {
    const record = await prisma.api_keys.findUnique({
        where: {
            client_type: "app",
            client_name: "Wooftrack",
        },
    });
    return record?.api_key;
}

async function getApiKey(apiKey: string) {
    const record = await prisma.api_keys.findUnique({
        where: {
            api_key: apiKey,
        },
    });
    return record?.api_key;
}

export { getWebApiKey, getMobileApiKey, getApiKey };
