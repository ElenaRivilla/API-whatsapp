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

function testErrControl(){
    testLoginValid();
}

testErrControl();