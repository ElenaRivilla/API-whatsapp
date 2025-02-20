import { errorMessage } from "./static.js";

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
        }
    });
}

export function responseValid(response) {
    return new Promise((resolve, reject) => {
        if (response.ok) resolve();

        let errorMessage = "";
        switch (response.status) {
            case 400:
                errorMessage = "La solicitud es incorrecta.";
                break;
            case 401:
                errorMessage = "No estás autenticado. Por favor, inicia sesión.";
                break;
            case 403:
                errorMessage = "No tienes permiso para acceder a este recurso.";
                break;
            case 404:
                errorMessage = "Usuario o contraseña incorrectos.";
                break;
            case 408:
                errorMessage = "La solicitud tardó demasiado en responder.";
                break;
            case 429:
                errorMessage = "Demasiadas solicitudes. Espera un momento antes de intentar nuevamente.";
                break;
            case 500:
                errorMessage = "¡Ups! Algo falló en nuestro sistema. Estamos trabajando en ello, intenta más tarde.";
                break;
            case 502:
                errorMessage = "Estamos teniendo problemas con nuestros servidores. Por favor, intenta acceder nuevamente en unos minutos.";
                break;
            case 503:
                errorMessage = "El servidor está en mantenimiento o sobrecargado. Inténtalo más tarde.";
                break;
            case 504:
                errorMessage = "La conexión tardó demasiado en responder.";
                break;
            default:
                errorMessage = `Error ${response.status}: ${response.statusText}. Algo inesperado ocurrió.`;
        }

        reject(new Error(errorMessage));
    });

    function manageErrors(error) {
        errorMessage();
        const errorContainer = document.querySelector("#errorText");
        errorContainer.innerText = error.message;  // Display the error message in the UI.
        const errorButton = document.querySelector("#closeError");
        errorButton.addEventListener("click", () => {
            document.querySelector("body").removeChild(document.querySelector("#errorHome"))
        })
        return;
    }
}