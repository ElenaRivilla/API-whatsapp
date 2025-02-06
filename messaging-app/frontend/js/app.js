// Import necessary modules for error handling and API interaction.
import { loginValid } from "./errControl.js";
import { userExists } from "./apiManager.js";

const loginUrl = "http://127.0.0.1:5500/messaging-app/frontend/templates/login.html";
const friendListUrl = "http://127.0.0.1:5500/messaging-app/frontend/templates/chatsList.html";

// Function to handle the login process, including validation and authentication.
function login(event) {
    event.preventDefault(); // Prevent the default form submission

    // Select the input fields for username and password.
    const username = document.querySelector("#username").value;
    const pwd = document.querySelector("#password").value;

    // Function to display error messages when validation or login fails.
    function manageErrors(error) {
        const errorContainer = document.querySelector(".error");
        errorContainer.innerText = error.message;  // Display the error message in the UI.
        return;
    }

    // Function to handle the full login process, including both validation and user existence check.
    function validateLogin(){
        return loginValid(username, pwd).then(() => {
            // If validation passes, proceed to check if the user exists.
            return userExists(username, pwd).then((user) => {
                // Store the username in localStorage upon successful login.
                localStorage.setItem('user', user.toString());
                window.location.href = friendListUrl; // Redirect to friend list page
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
    validateLogin();
}

// Add event listener to the form
document.querySelector("#loginForm").addEventListener("submit", login);

function friendsSite() {
    // Functionality for the friends site
}

// Function to initialize the page based on the current URL.
// TODO: Change the login URL to the correct one and add any additional cases.
function init(){
    switch(window.location.href){
        case loginUrl:
            // No need to call login() here, as it will be called by the form submit event
            break;
        case friendListUrl:
            friendsSite();
            break;
        default:
            // No action needed for other URLs, just break out of the switch.
            break;
    }
}

// Run the init function when the document is fully loaded.
document.addEventListener("DOMContentLoaded", init);