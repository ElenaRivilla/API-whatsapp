// Import necessary modules for error handling and API interaction.
import * as errControl from "/./errControl.js";
import * as apiManager from "/./apiManager.js";

// Function to handle the login process, including validation and authentication.
function login(){
    // Select the form and the input fields for username and password.
    const form = document.querySelector("#loginForm");
    const username = document.querySelector("#username");
    const pwd = document.querySelector("#pwd");

    // Promise for validating the login input (username and password).
    let validation = new Promise((resolve, reject) => {
        try {
            // Check if the username and password meet the validation criteria.
            if (errControl.loginValid(username.value, pwd.value)) {
                resolve();  // Validation passed
            }
        } catch (error) {
            reject(error.message);  // Validation failed with an error
        }
    });

    // Promise to verify if the user exists with the provided credentials.
    let login = new Promise((resolve, reject) => {
        try {
            // If the credentials are correct, the user exists, so resolve the promise.
            if(apiManager.userExists(username.value, pwd.value)){
                resolve(username.value);
            }
            else{
                reject("Incorrect username or password.");
            }
        } catch (error) {
            reject("Server error, please try again later.");
        }
    });
      
    // Function to display error messages when validation or login fails.
    function manageErrors(error){
        const errorContainer = document.querySelector("#error");
        errorContainer.innerText = error;  // Display the error message in the UI.
        return;
    }

    // Function to handle the full login process, including both validation and user existence check.
    function validateLogin(){
        validation.then(() => {
            // If validation passes, proceed to check if the user exists.
            return login.then((username) => {
                // Store the username in localStorage upon successful login.
                localStorage.setItem('username', username);
                return true;  // Login successful
            }).catch((error) => {
                manageErrors(error);  // Display error if login fails
                return false;  // Login failed
            });
        }).catch((error) => {
            manageErrors(error);  // Display error if validation fails
            return false;  // Validation failed
        });
    }

    // Function to redirect the user to another page after a successful login.
    function redirect(){
        // TODO: Change the URL to the appropriate one for the next page after a successful login.
        window.location.href = '/nuevo_directorio/nueva_pagina.html';
    }

    // Event listener to handle form submission.
    form.addEventListener("submit", function(event) {
        event.preventDefault();  // Prevent the default form submission (page reload).
        if (validateLogin()) {
            redirect();  // Redirect to the new page if login is successful.
        }
    });
}

// Function to initialize the page based on the current URL.
// TODO: Change the login URL to the correct one and add any additional cases.
function init(){
    switch(window.location.href){
        case "login_url":
            login();  // Initialize the login process if on the login page.
            break;
        default:
            // No action needed for other URLs, just break out of the switch.
            break;
    }
}

// Run the init function when the document is fully loaded.
document.addEventListener("DOMContentLoaded", init);