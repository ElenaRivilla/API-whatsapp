// Import necessary modules for error handling and API interaction.
import * as errControl from "/./errControl.js";
import * as apiManager from "/./apiManager.js";

// Switch statement to check the current URL and decide what action to take.
// TODO: Change the URL to the correct one and add any additional cases.
switch(window.location.href){
    case "login_url":
        // When the page loads, initialize the login process by calling the `init` function.
        document.addEventListener("DOMContentLoaded", init);
        break;
    default:
        // No action needed for other URLs, just break out of the switch.
        break;
}

// Function to initialize the login form and handle validation and login processes.
function init(){
    // Select the necessary DOM elements for the login form, username, and password fields.
    const form = document.querySelector("#loginForm");
    const username = document.querySelector("#username");
    const pwd = document.querySelector("#pwd");

    // Create a promise for validating the login input (username and password).
    // The promise checks if the inputs are valid using the `loginValid` function from `errControl`.
    let validation = new Promise((resolve, reject) => {
        try {
            // If the login is valid (username and password pass validation), resolve the promise.
            if (errControl.loginValid(username.value, pwd.value)) {
                resolve();
            }
        } catch (error) {
            // If an error occurs during validation, reject the promise with the error message.
            reject(error.message);
        }
    });

    // Create a promise for checking whether the user exists using the `userExists` function from `apiManager`.
    // This function checks the credentials against the backend system.
    let login = new Promise((resolve, reject) => {
        try {
            // If the user exists (valid credentials), resolve the promise with the username.
            if(apiManager.userExists(username.value, pwd.value)){
                resolve(username.value);
            }
            else{
                // If the user does not exist or the credentials are incorrect, reject the promise with an error message.
                reject("Usuario o contraseña incorrectos");
            }
        } catch (error) {
            // If an error occurs with the server interaction, reject the promise with a server error message.
            reject("Hay un fallo con el servidor, por favor inténtalo de nuevo más tarde.");
        }
    });
      
    // Function to display error messages on the page if validation or login fails.
    function manageErrors(error){
        // Select the error container in the DOM where error messages are displayed.
        const errorContainer = document.querySelector("#error");
        // Set the error message to be displayed in the error container.
        errorContainer.innerText = error;
        return;
    }

    // Function to validate the login credentials by checking both validation and user existence.
    // This function handles the chaining of the `validation` and `login` promises.
    function validateLogin(){
        // Start by checking if the validation promise resolves successfully.
        validation.then(() => {
            // If validation is successful, proceed to check the login promise.
            return login.then((username) => {
                // If the login is successful, store the username in localStorage for session management.
                localStorage.setItem('username', username);
                // Return true to indicate the login process was successful.
                return true;
            }).catch((error) => {
                // If login fails (wrong username/password), call `manageErrors` to display the error message.
                manageErrors(error);
                // Return false to indicate the login failed.
                return false;
            });
        }).catch((error) => {
            // If validation fails (input is invalid), call `manageErrors` to display the validation error message.
            manageErrors(error);
            // Return false to indicate the validation failed.
            return false;
        });
    }

    // Event listener for form submission.
    form.addEventListener("submit", function(event) {
        // Prevent the default form submission behavior (which would cause a page refresh).
        event.preventDefault(); 
        // Call `validateLogin` and proceed only if the validation is successful (returns true).
        if (validateLogin()) {
            // TODO: Change the URL to the appropriate one for the next page after a successful login.
            // Redirect the user to a new page after successful login.
            window.location.href = '/nuevo_directorio/nueva_pagina.html';
        }
    });
}