// TODO Revisar como exportar toda la clase.
export function loginValid(username, password) { 
    return  new Promise((resolve, reject) => {
        // El required ya está puesto en el html.
        const regex = /(^[0-9]{7}[A-Z]$)|(^[0-9]{8}$)/;
        const regexUser = /^[^0-9]*$/;
        if (!regexUser.test(username)) {
            reject(new Error("El nombre de usuario no puede contener números."));
        }
        if (!regex.test(password)) {
            reject(new Error("La contraseña debe ser un NIE de siete dígitos y una letra mayúscula o un DNI con ocho dígitos."));
        }
        resolve();
    });
}