export function validateLogin(username, password) { // TODO Revisar como exportar toda la clase.
    // El required ya está puesto en el html.
    const regex = /(^[0-9]{7}[A-Z]$)|(^[0-9]{8}$)/;
    const regexUser = /^[^0-9]*$/;
    if (!regexUser.test(username)) {
        throw new Error("Username must not contain numbers.");
    }

    if (!regex.test(password)) {
        throw new Error("Password must be a NIE with 7 digits + 1 uppercase letter or DNI with 8 digits.");
    }
    return;
}
