export function loginValid(username, password) {
    return new Promise((resolve, reject) => {
        // El required ya está puesto en el html.
        const regexUser = /^[A-Za-z]{1,50}$/;
        const regex = /^([A-Z][0-9]{7}|[0-9]{8})$/;

        if (!regexUser.test(username)) {
            reject(new Error("El nombre de usuario no puede contener números."));
        }
        if (!regex.test(password)) {
            reject(new Error("La contraseña debe ser un NIE con la primera letra mayúscula y sin letra final o un DNI sin la letra final."));
        }
        resolve();
    });
}

// TODO pendiente revisar y cambiar
export function responseValid(response) {
    return new Promise((resolve, reject) => {
        if (!response.ok) {
            reject(new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`));
        }
        resolve();
    });
}