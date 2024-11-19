import { SignJWT, decodeJwt, jwtVerify } from "jose";
import { hashSync, compareSync } from "bcryptjs";
import type { users } from "@prisma/client";
// import { logger } from "@/lib/logger";
import { environment } from "../infra/environment";

async function createToken(user: users) {
    // tricky to allow us set the password in null
    user.password = null as unknown as string;
    const signer = new SignJWT(user)
        .setExpirationTime("1 day")
        .setProtectedHeader({ alg: "HS256", typ: "JWT" });
    const token = await signer.sign(
        new TextEncoder().encode(environment.tokenSecret)
    );
    //   logger.info(`Token created for user "${user.email}":`, token);
    return token;
}

async function decodeToken(token: string): Promise<users> {
    const user = decodeJwt(token) as users;
    //   logger.info(`Decoded token`, user);
    return user;
}

async function checkToken(token: string): Promise<boolean> {
    try {
        await jwtVerify(
            token,
            new TextEncoder().encode(environment.tokenSecret)
        );
        return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        // logger.danger(
        //   "Ocurrió un error al verificar el token:",
        //   (err as Error).message,
        // );
        return false;
    }
}

function hashPassword(rawPassword: string): string {
    return hashSync(rawPassword, 10);
}

function comparePasswords(
    rawPassword: string,
    hashedPassword: string
): boolean {
    return compareSync(rawPassword, hashedPassword);
}

export { createToken, decodeToken, hashPassword, comparePasswords, checkToken };
