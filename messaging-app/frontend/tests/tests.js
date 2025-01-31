//import * as errControl from "../js/errControl.js";

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

function testErrControl(){
    testLoginValid();
}

/* testErrControl(); */

//chats de pruebas
export const openChats = [
    {
        username: "Alice Johnson",
        message: "Mensaje de Alice que debería truncarse con puntos suspensivos si es demasiado largo para el contenedor.",
        time: "10:00h",
        imageUrl: "https://picsum.photos/300/300?random=7"
    },
    {
        username: "Bob Smith",
        message: "Este es un mensaje de Bob que también debería truncarse si es demasiado largo para el contenedor.",
        time: "10:30h",
        imageUrl: "https://picsum.photos/300/300?random=8"
    },
    {
        username: "Charlie Brown",
        message: "Mensaje de Charlie que debería truncarse con puntos suspensivos si es demasiado largo para el contenedor.",
        time: "11:00h",
        imageUrl: "https://picsum.photos/300/300?random=9"
    },
    {
        username: "Diana Prince",
        message: "Este es un mensaje de Diana que también debería truncarse si es demasiado largo para el contenedor.",
        time: "11:30h",
        imageUrl: "https://picsum.photos/300/300?random=10"
    },
    {
        username: "Eve Adams",
        message: "Mensaje de Eve que debería truncarse con puntos suspensivos si es demasiado largo para el contenedor.",
        time: "12:00h",
        imageUrl: "https://picsum.photos/300/300?random=11"
    }
];

export const messages = [
    {
        type: "sender",
        imageUrl: "https://picsum.photos/300/300?random=1",
        message: "Hola, ¿cómo estás?",
        time: "10:35"
    },
    {
        type: "receiver",
        message: "¡Hola! Estoy bien, ¿y tú?",
        time: "10:36",
        checkImageUrl: "../assets/svg/double-check-blue.svg"
    },
    {
        type: "sender",
        imageUrl: "https://picsum.photos/300/300?random=1",
        message: "También estoy bien, gracias. ¿Qué planes tienes para hoy?",
        time: "10:37"
    },
    {
        type: "receiver",
        message: "Voy a trabajar en un proyecto. ¿Y tú?",
        time: "10:38",
        checkImageUrl: "../assets/svg/double-check-blue.svg"
    },
    {
        type: "sender",
        imageUrl: "https://picsum.photos/300/300?random=1",
        message: "Tengo una reunión en la tarde, pero después estoy libre. Podemos vernos y discutir sobre el proyecto que mencionaste la última vez. Me parece una gran oportunidad para avanzar y resolver algunas dudas que tengo. Además, podríamos aprovechar para revisar los documentos que nos enviaron y planificar las siguientes etapas. ¿Qué te parece? Si tienes alguna otra idea o sugerencia, estaré encantado de escucharla. Nos vemos más tarde.",
        time: "10:39"
    },
    {
        type: "receiver",
        message: "Genial, tal vez podamos vernos después.",
        time: "10:40",
        checkImageUrl: "../assets/svg/double-check-blue.svg"
    },
    {
        type: "sender",
        imageUrl: "https://picsum.photos/300/300?random=1",
        message: "Gracias, ¡Hasta luego!",
        time: "10:39"
    },
    {
        type: "receiver",
        message: "¡Hasta luego!",
        time: "10:40",
        checkImageUrl: "../assets/svg/double-check-blue.svg"
    }
];