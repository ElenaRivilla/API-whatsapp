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


export function SettingsAccountValidation(newName, newBio) {
    return new Promise((resolve, reject) => {
        const nameRegex = /^[A-Za-z]{1,50}$/;
        const bioRegex = /^.{1,175}$/;
        let isValid = true;

        if (!nameRegex.test(newName) || newName.trim() === "") {
            $('.regexName-message').removeClass('hidden');
            isValid = false;
        } else {
            $('.regexName-message').addClass('hidden');
        }

        if (!bioRegex.test(newBio) || newBio.trim() === "") {
            $('.regexBio-message').removeClass('hidden');
            isValid = false;
        } else {
            $('.regexBio-message').addClass('hidden');
        }

        if (isValid) {
            resolve();
        } else {
            reject(new Error("Validation failed"));
        }
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