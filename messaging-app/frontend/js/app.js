// Import necessary modules for error handling and API interaction.
import { loginValid } from "./errControl.js";
import { userExists, getUsersHome, getMessagesUser } from "./apiManager.js";
import { User } from "./user.js"
import { generateChats, generateChat } from "./chat.js";
import {generateSettings, accountSettings} from "./settings.js";
import {generateRightPanelFund, generateSearchBar} from "./static.js";

// TODO Remove liveServerPrefix when deploying the app
const liveServerPrefix = "http://127.0.0.1:5500";
const loginUrl = liveServerPrefix + "/messaging-app/frontend/templates/login.html";
const homeUrl = liveServerPrefix + "/messaging-app/frontend/templates/home.html";

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
}

// Function to handle the login process, including validation and authentication.
function login() {
    // Select the form and the input fields for username and password.
    const form = document.querySelector("#loginForm");
    const username = document.querySelector("#username");
    const pwd = document.querySelector("#password");

    // Function to display error messages when validation or login fails.
    function manageErrors(error) {
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
            const response = await userExists(username.value, pwd.value);
            const user = new User(response);

            // If both promises are successful, store the user in localStorage
            // path=/messaging-app/frontend/;
            document.cookie = "token=" + encodeURIComponent(response['token']) + "; path=/; Secure; SameSite=Strict";
            document.cookie = "user=" + encodeURIComponent(user.toString()) + "; path=/; Secure; SameSite=Strict";
            redirect();  // Redirect to the new page if login is successful.
            return;
        } catch (error) {
            // If any promise is rejected, it will be caught here
            manageErrors(error);  // Display the error if one occurs
            return;  // Return false if there was an error
        }
    }

    // Function to redirect the user to another page after a successful login.
    function redirect() {
        window.location.href = homeUrl;
    }

    // Event listener to handle form submission.
    form.addEventListener("submit", function (event) {
        event.preventDefault();  // Prevent the default form submission (page reload).
        validateLogin();
    });
}

function home() {
    const user = new User(JSON.parse(getCookie('user')));
    const leftContainer = $(".scrollbar-custom");
    const rightContainer = $(".chats");
    const settingsButton = $('.settings-bar')[0];
    const searchBar = $(".search-bar");
    const header = $("header");
    generateRightPanelFund();

    if (window.innerWidth < 768) {
        updateDOM(generateSearchBar().html(), searchBar);
        searchBar.addClass("block");
    }

    generateRightPanelFund();
    function addEvents(node, event) {
        // node[0] porque aparentemente cuando pillas un nodo con jquery hace un array con metadatos y el primer
        // elemento es el nodo
        for (let childNode of node[0].children) {
            childNode.addEventListener("click", () => event(childNode));

        }
    }

    function getUsernameFromNode(node) {
        // Recibe el nombre del usuario (ej: el usuario al que vas a hablar en el chat)
        return node.children[1].children[0].innerText;
    }

    function openChat(node) {
        // Carga los 10 mensajes entre el usuario anfitrion y el usuario amigo (reciever_id).
        loadMessages(user.username, getUsernameFromNode(node), 10);
        if (window.innerWidth < 768) {
            const container = $(".container-user");
            container.on("click", () => {
            });
            $(".contacts").removeClass("block").addClass("hidden");
            $(".chats").removeClass("hidden md:block sm:hidden").addClass("block");
            header.removeClass("block").addClass("hidden");
        }
        return;
    }

    async function loadFriends() {
        // Carga todos la lista de amigos del usuario
        try {
            const response = await getUsersHome();
            const chats = generateChats(response.contacts); // Genera los chats.
            updateDOM(chats.html(), leftContainer);  // Actualiza el DOM con los chats generados.
            addEvents(leftContainer, openChat); // Añade los eventos en el panel izquierdo al hacer click sobre un contacto.
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    function updateDOM(html, section){
        section.empty(); // Limpiar el contenedor antes de agregar nuevos chats
        section.html(html);
        return;
    }

    async function loadMessages(user1, user2, loadSize) {
        try {
            const response = await getMessagesUser(user1, user2, loadSize);
            const chat = generateChat(response, user2);
            updateDOM(chat.html(), rightContainer);
            // add event listeners?
            if (window.innerWidth < 768) {
                const backContainer = $(".back-button");
                backContainer.on("click", () => {
                    $(".contacts").removeClass("hidden").addClass("block");
                    $(".chats").removeClass("block").addClass("hidden md:block sm:hidden");
                    header.removeClass("hidden ").addClass("block sm:block");
                });
            }
        }
        catch (error) {
            console.error("Error:", error);
        }
    }

    // La parte de Settings:

    function settingsFunctions() {
        settingsButton.addEventListener("click", () => {
            updateDOM("", leftContainer);
            const settings = generateSettings(user);
            updateDOM(settings.html(), leftContainer);
    
            const backButton = $('.back-button');
            backButton.on("click", () => {
                loadFriends();
            });

            // Creo la constante del boton aquí por que si la pongo arriba, no la detecta.
            const accountSettingButton = $("#Cuenta");
            accountSettingButton.on("click", () => {
                updateDOM("", rightContainer);

                const cuenta = accountSettings();
                updateDOM(cuenta.html(), rightContainer);
            });
        });
    }
    settingsFunctions();

    // La parte de Contacts:
    

    // hacer add event-listeners a los botones como mostrar chat, nuevo grupo y settings, para que cambien el dom
    // setInterval(loadFriends(), 30000); // que lo haga cada x minutos, asi se refrescan los mensajes

    loadFriends();

    window.addEventListener('resize', () => {
        updateDOM(generateHeaderMobile().html(), searchBar);
        if (window.innerWidth > 768) {
            searchBar.empty()
            $(".contacts").removeClass("hidden").addClass("block");
            $(".chats").removeClass("block").addClass("hidden md:block sm:hidden");
            loadFriends();
        }
    });
    return;
}

// Function to initialize the page based on the current URL.
// TODO: Change the login URL to the correct one and add any additional cases.
function init() {
    switch (window.location.href) {
        case loginUrl:
            login();  // Initialize the login process if on the login page.
            break;
        case homeUrl:
            home();
            break;
        default:
            // No action needed for other URLs, just break out of the switch.
            break;
    }
}

// Run the init function when the document is fully loaded.
document.addEventListener("DOMContentLoaded", init);