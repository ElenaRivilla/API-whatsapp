export function loginValid(username, password) { // TODO Revisar como exportar toda la clase.
    // El required ya está puesto en el html.
    const regex = /(^[0-9]{7}[A-Z]$)|(^[0-9]{8}$)/;
    const regexUser = /^[^0-9]*$/;
    if (!regexUser.test(username)) {
        throw new Error("El nombre de usuario no puede contener números.");
    }

    if (!regex.test(password)) {
        throw new Error("La contraseña en NIE necesita 7 dígitos + 1 letra en mayúsculas o el DNI con 8 dígitos.");
    }
    return true;
}
