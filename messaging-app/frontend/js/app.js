// Import necessary modules for error handling and API interaction.
import * as errControl from "./errControl.js";
import * as apiManager from "./apiManager.js";

const loginUrl = "";
const friendListUrl = "";

// Function to handle the login process, including validation and authentication.
function login(){
    // Select the form and the input fields for username and password.
    const form = document.querySelector("#loginForm");
    const username = document.querySelector("#username").value;
    const pwd = document.querySelector("#password").value;
      
    // Function to display error messages when validation or login fails.
    function manageErrors(error){
        const errorContainer = document.querySelector(".error");
        errorContainer.innerText = error.message;  // Display the error message in the UI.
        return;
    }

    // Function to handle the full login process, including both validation and user existence check.
    function validateLogin(){
        errControl.loginValid(username, pwd).then(() => {
            // If validation passes, proceed to check if the user exists.
            return apiManager.userExists(username, pwd).then(() => {
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
        window.location.href = friendListUrl;
    }

    // Event listener to handle form submission.
    form.addEventListener("submit", function(event) {
        event.preventDefault();  // Prevent the default form submission (page reload).
        if (validateLogin()) {
            redirect();  // Redirect to the new page if login is successful.
        }
    });
}

function getFriends() {

}

// Function to initialize the page based on the current URL.
// TODO: Change the login URL to the correct one and add any additional cases.
function init(){
    switch(window.location.href){
        case loginUrl:
            login();  // Initialize the login process if on the login page.
            break;
        case friendListUrl:
            getFriends();
            break;
        default:
            // No action needed for other URLs, just break out of the switch.
            break;
    }
}

// Run the init function when the document is fully loaded.
document.addEventListener("DOMContentLoaded", init);