// Import necessary modules for error handling and API interaction.
import { loginValid } from "./errControl.js";
import { userExists } from "./apiManager.js";
import { User } from "./user.js" 

// TODO Remove liveServerPrefix when deploying the app
const liveServerPrefix = "http://127.0.0.1:5500";
const loginUrl = liveServerPrefix + "/messaging-app/frontend/templates/login.html";
const friendListUrl = liveServerPrefix + "/messaging-app/frontend/templates/chatsList.html";

function getCookie(name) {
    const parts = document.cookie.split(`${name}=`);  // Buscamos el nombre de la cookie en el texto de las cookies.
    if (parts.length === 2) return decodeURIComponent(parts[1].split(';')[0]);  // Si la cookie existe, la extraemos.
    return null;  // Si no existe, devolvemos null.
}

// Function to handle the login process, including validation and authentication.
function login(){
    // Select the form and the input fields for username and password.
    const form = document.querySelector("#loginForm");
    const username = document.querySelector("#username");
    const pwd = document.querySelector("#password");
      
    // Function to display error messages when validation or login fails.
    function manageErrors(error){
        const errorContainer = document.querySelector(".error");
        errorContainer.innerText = error.message;  // Display the error message in the UI.
        return;
    }

    // Function to handle the full login process, including both validation and user existence check.
    async function validateLogin() {
        try {
            // Wait for the first promise (loginValid) to resolve
            await loginValid(username.value, pwd.value);
    
            // If loginValid is successful, wait for the second promise (userExists)
            const user = await userExists(username.value, pwd.value);

            // If both promises are successful, store the user in localStorage
            // document.cookie = "token=" + encodeURIComponent(user['token']) + "; path=/messaging-app/frontend/; Secure; SameSite=Strict";
            document.cookie = "token=" + encodeURIComponent(user['token']) + "; path=/; Secure; SameSite=Strict";
            document.cookie = "user=" + encodeURIComponent(username) + "; path=/; Secure; SameSite=Strict";
            redirect();  // Redirect to the new page if login is successful.
            return;
        } catch (error) {
            // If any promise is rejected, it will be caught here
            manageErrors(error);  // Display the error if one occurs
            return;  // Return false if there was an error
        }
    }

    // Function to redirect the user to another page after a successful login.
    function redirect(){
        window.location.href = friendListUrl;
    }

    // Event listener to handle form submission.
    form.addEventListener("submit", function(event) {
        event.preventDefault();  // Prevent the default form submission (page reload).
        validateLogin();
    });
}

async function friendsSite() {
    try {
        const user = new User(getCookie('user'));
        const users = await getUsersHome(getCookie('token'));
        console.log(users);  // Log the users to the console or handle them as needed
        generateChats(users);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

// Function to initialize the page based on the current URL.
// TODO: Change the login URL to the correct one and add any additional cases.
function init(){
    switch(window.location.href){
        case loginUrl:
            login();  // Initialize the login process if on the login page.
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