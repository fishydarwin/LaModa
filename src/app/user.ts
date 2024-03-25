export interface User {
    id: number;

    name: string;
    password_obfuscated: string;
    email: string;

    role: string; // will forever be user, mod, or admin
}

export class UserValidator {

    private static PASSWORD_REGEX = /^\w+$/;

    // https://regexr.com/3e48o
    private static EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    static validate(user: User) {
        if (user.name.trim().length <= 0) {
            return "Vă rugăm să introduceți numele dvs.";
        }
        if (user.name.trim().length > 100) {
            return "Numele dvs trebuie să fie cel mult 100 de caractere.";
        }
        if (user.password_obfuscated.trim().length < 8) {
            return "Parola dvs. trebuie să conțină cel putin 8 caractere.";
        }
        if (!this.PASSWORD_REGEX.test(user.password_obfuscated)) {
            return "Parola dvs. trebuie să conțină doar litere sau cifre.";
        }
        if (!this.EMAIL_REGEX.test(user.email)) {
            return "Vă rugăm să introduceți o adresă de e-mail validă."
        }

        return "OK";
    }
}
