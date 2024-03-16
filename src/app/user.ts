export interface User {
    id: number;

    name: string;
    password_obfuscated: string;
    email: string;

    role: string; // will forever be user, mod, or admin
}
