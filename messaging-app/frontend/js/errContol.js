// TODO Revisar como exportar toda la clase.
export function loginValid(username, password) { 
    return  new Promise((resolve, reject) => {
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
export function responseValid(response){
    return  new Promise((resolve, reject) => {
        if (!response.ok) {
            reject(new Error(`Error en la respuesta del servidor: ${response.status}`));
        }
        resolve();
    });
}

/* ------ TESTS ------ */

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
        loginValid(username, password).then(() => {
            console.log(`Éxito: ${username}, ${password} - válido`);
        }).catch((error) => {
            console.log(`Error: ${username}, ${password} - ${error.message}`);
        });
    }
}