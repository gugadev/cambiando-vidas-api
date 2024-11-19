import crypto from "node:crypto";

async function generateKey() {
    const key = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
    const jsonWebKey = await crypto.subtle.exportKey("jwk", key);
    return {
        key: jsonWebKey.k,
        createdAt: new Date(),
    };
}

// eslint-disable-next-line no-undef
generateKey().then((key) => console.log(key));
