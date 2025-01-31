import * as errControl from "../js/errContol";

function testLoginValid() {
    const testData = [
        { username: "John", password: "A1234567" }, // valid
        { username: "Maria", password: "12345678" }, // valid
        { username: "Carlos123", password: "A1234567" }, // invalid: username contains numbers
        { username: "Ana", password: "B7654321" }, // valid
        { username: "Laura", password: "98765432" }, // valid
        { username: "Eve", password: "7654321" }, // invalid: password doesn't have 8 digits or uppercase letter
        { username: "James", password: "C1234567" }, // valid
        { username: "Peter123", password: "12345678" }, // invalid: username contains numbers
        { username: "JohnDoe", password: "A1234567" }, // valid
        { username: "Ariana", password: "87654321" }, // valid
        { username: "Ethan123", password: "A234567" }, // invalid: password doesn't have 8 digits or uppercase letter
        { username: "Grace", password: "B8765432" }, // valid
        { username: "Sophia", password: "C1234567" }, // valid
        { username: "Leo123", password: "12345678" }, // invalid: username contains numbers
        { username: "Isabella", password: "D2345678" }, // valid
        { username: "Mia", password: "A1234567" }, // valid
        { username: "Daniela", password: "12345678" }, // valid
        { username: "Zoe123", password: "98765432" }, // invalid: username contains numbers
        { username: "Olivia", password: "A7654321" }, // valid
        { username: "Amelia", password: "A1234567" }, // valid
    ];          

    for (const { username, password } of testData) {
        errControl.loginValid(username, password).then(() => {
            console.log(`Éxito: ${username}, ${password} - válido`);
        }).catch((error) => {
            console.log(`Error: ${username}, ${password} - ${error.message}`);
        });
    }
}

function testResponnseValid() {
    const responses = [
        // **Casos válidos** (200-299)
        { ok: true, status: 200, statusText: "OK" }, // Respuesta exitosa
        { ok: true, status: 201, statusText: "Created" }, // Recurso creado correctamente
        { ok: true, status: 204, statusText: "No Content" }, // Sin contenido (eliminación exitosa)
        { ok: true, status: 208, statusText: "Already Reported" }, // Ya reportado (para WebDAV)
        { ok: true, status: 226, statusText: "IM Used" }, // Usado IM (Intermediary Manipulation)

        // **Casos de error** (otros códigos fuera de 200-299)
        { ok: false, status: 400, statusText: "Bad Request" }, // Petición incorrecta
        { ok: false, status: 401, statusText: "Unauthorized" }, // Falta de autenticación
        { ok: false, status: 403, statusText: "Forbidden" }, // El servidor entiende pero no permite la acción
        { ok: false, status: 404, statusText: "Not Found" }, // Recurso no encontrado
        { ok: false, status: 405, statusText: "Method Not Allowed" }, // El método no está permitido para este recurso
        { ok: false, status: 406, statusText: "Not Acceptable" }, // El recurso no es adecuado para los parámetros solicitados
        { ok: false, status: 408, statusText: "Request Timeout" }, // La solicitud tardó demasiado
        { ok: false, status: 409, statusText: "Conflict" }, // Conflicto con el estado actual del recurso
        { ok: false, status: 410, statusText: "Gone" }, // Recurso eliminado de forma permanente
        { ok: false, status: 413, statusText: "Payload Too Large" }, // La carga de la solicitud es demasiado grande
        { ok: false, status: 414, statusText: "URI Too Long" }, // La URL solicitada es demasiado larga
        { ok: false, status: 415, statusText: "Unsupported Media Type" }, // El tipo de medio no es compatible
        { ok: false, status: 429, statusText: "Too Many Requests" }, // Límite de solicitudes alcanzado
        { ok: false, status: 500, statusText: "Internal Server Error" }, // Error interno del servidor
        { ok: false, status: 502, statusText: "Bad Gateway" }, // Problema con el servidor intermedio
        { ok: false, status: 503, statusText: "Service Unavailable" }, // El servidor no está disponible temporalmente
        { ok: false, status: 504, statusText: "Gateway Timeout" }, // Timeout en la puerta de enlace
        { ok: false, status: 505, statusText: "HTTP Version Not Supported" }, // La versión HTTP no es soportada
    ];

    for (let x = 0; x < responses.length; x++) {
        responseValid(responses[x])
            .then(() => console.log(`Respuesta válida: ${responses[x].status} ${responses[x].statusText}`))
            .catch(error => console.error(`${error.message}`))       
    }
}


function testErrControl(){
    testLoginValid();
    testResponnseValid();

}

testErrControl();




