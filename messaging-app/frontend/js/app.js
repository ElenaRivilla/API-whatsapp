// Import necessary modules for error handling and API interaction.
import { loginValid } from "./errControl.js";
import { userExists, getUsersHome, getMessagesUser, getContacts, sendMessage } from "./apiManager.js";
import { User } from "./user.js"
import { generateChats, generateChat } from "./chat.js";
import { generateSettings, accountSettings, privacitySettings, chatSettings, notificationSettings, helpSettings, closeSession } from "./settings.js";
import { generateRightPanelFund, generateSearchBar, setDarkMode, setLightMode } from "./static.js";
import { generateContacts } from "./contactsList.js";
import { formGroup, generateGroupContainer } from "./createGroup.js";

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

    if (window.innerWidth < 768) {
        updateDOM(generateSearchBar().html(), searchBar);
        searchBar.addClass("block");
    }

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

    async function openChat(node) {
        try {
            // Carga los 10 mensajes entre el usuario anfitrion y el usuario amigo (reciever_id).
            await loadMessages(user.username, getUsernameFromNode(node), 10);
            // Desplazar el contenedor hacia abajo
            setTimeout(() => {
                const container = $(".messages-container");
                container.scrollTop(container[0].scrollHeight);
            }, 0);
            if (window.innerWidth < 768) {
                const container = $(".container-user");
                container.on("click", () => {
                });
                $(".contacts").removeClass("block").addClass("hidden");
                $(".chats").removeClass("hidden md:block sm:hidden").addClass("block");
                header.removeClass("block").addClass("hidden");
            }
            const chat = document.querySelector(".messages-container");
            chat.addEventListener('scroll', () => {
                if (chat.scrollTop === 0) {
                    loadMessages(user.username, getUsernameFromNode(node), 20);
                }
            });
            return;
        } catch (error) {
            console.error("Error fetching users:", error);
        }
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

    function updateDOM(html, section) {
        section.empty(); // Limpiar el contenedor antes de agregar nuevos chats
        section.html(html);
        return;
    }

    async function loadMessages(user1, user2, loadSize) {
        try {
            const response = await getMessagesUser(user1, user2, loadSize);
            const chat = generateChat(response, user2);
            updateDOM(chat.html(), rightContainer);
            user.setOpenChat(true);
            //changeRadius();
            if (window.innerWidth < 768) {
                const backContainer = $(".back-button");
                backContainer.on("click", () => {
                    $(".contacts").removeClass("hidden").addClass("block");
                    $(".chats").removeClass("block").addClass("hidden md:block sm:hidden");
                    header.removeClass("hidden ").addClass("block sm:block");
                });
            }
            $('.textBarForm')[0].addEventListener("submit", function (event) {
                event.preventDefault();  // Prevent the default form submission (page reload).
                send(user2);
            });
        }
        catch (error) {
            console.error("Error:", error);
        }
    }

    async function send(receiver) {
        const msgBody = $('.write-message')[0].value;
        if (msgBody) {
            try {
                const message = {
                    "body": msgBody,
                    "receiver": receiver
                };
                await sendMessage(message);
                await loadMessages(user.username, receiver, 10);
                setTimeout(() => {
                    const container = $(".messages-container");
                    container.scrollTop(container[0].scrollHeight);
                }, 0);
                await loadFriends();
            }
            catch (error) {
                console.error("Error:", error);
            }
        }
        return;
    }

    // La parte de Settings:
    function settingsFunctions() {
        settingsButton.addEventListener("click", () => {
            if (window.innerWidth < 768) {
                header.removeClass("block").addClass("hidden");
            }
            updateDOM(generateSettings(user).html(), leftContainer);

            $('.back-button')[0].addEventListener("click", () => {
                if (window.innerWidth < 768) {
                    header.removeClass("hidden").addClass("block");
                }
                if (!user.hasOpenChat) {
                    updateDOM(generateRightPanelFund().html(), rightContainer);
                }
                loadFriends();
            });

            $("#account")[0].addEventListener("click", () => {
                updateDOM(accountSettings(user).html(), rightContainer);
                user.setOpenChat(false);
            });
            //addSettingEvent($("#privacy")[0], privacitySettings, rightContainer);
            $("#chats")[0].addEventListener('click', () => {
                updateDOM(chatSettings().html(), rightContainer);
                user.setOpenChat(false);
                $(".modeChanger")[0].addEventListener('click', () => {
                    if (user.lightMode) {
                        setDarkMode();
                        user.setLightMode(false);
                    }
                    else {
                        setLightMode();
                        user.setLightMode(true);
                    }
                });
            });
            //addSettingEvent($("#notifications")[0], notificationSettings, rightContainer);
            //addSettingEvent($("#help")[0], helpSettings, rightContainer);
            $("#logout")[0].addEventListener("click", () => {
                user.setOpenChat(false);
                closeSession(loginUrl);
            });
        });
    }

    // La parte de Contacts:
    async function contacts(user) {
        try {
            const response = await getContacts(user);
            response.friends.sort((a, b) => a.username.localeCompare(b.username));

            if (window.innerWidth < 768) {
                header.removeClass("block").addClass("hidden");
            }
            updateDOM(generateContacts(response.friends).html(), leftContainer);

            $(document).on("click", ".add-group-button", function () {
                $(".container-group").remove();
                updateDOM(formGroup(response.friends).html(), rightContainer);
                user.setOpenChat(false);
            });
            
            if ($._data($(document)[0], "events").click.some(event => event.selector === ".add-group-button")) {
                creationGroup();
            }
            
            $(document).on("click", ".back-button-contact", function () {
                header.removeClass("hidden").addClass("block");
                if (!user.hasOpenChat) {
                    updateDOM(generateRightPanelFund().html(), rightContainer);
                }
                loadFriends();
            });
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    }

    function chats() {
        $(".chat-button")[0].addEventListener("click", () => {
            if (!user.hasOpenChat) {
                loadFriends();
                updateDOM(generateRightPanelFund().html(), rightContainer);
            }
        });
    }

    if (window.innerWidth < 768) {
        updateDOM(generateSearchBar().html(), searchBar);
        searchBar.addClass("block");
    }

    function creationGroup() {
        const selectedContacts = [];
    
        // Añadir evento de clic a cada contenedor de usuario
        $(".container-user").each(function() {
            $(this).on("click", function() {
                $(this).hide(); // Ocultar el contenedor de usuario
                $(".contact-separator")[0].remove();
    
                // Extraer los atributos del contenedor de usuario
                const username = $(this).find(".username").text();
                const bio = $(this).find(".message").text();
                const imageUrl = $(this).find(".profile-image").attr("src");
    
                // Crear un objeto con los atributos extraídos
                const contact = {
                    username: username,
                    bio: bio,
                    image: imageUrl
                };
    
                // Añadir el objeto al array de contactos seleccionados
                selectedContacts.push(contact);
    
                // Generar el contenedor del grupo con los contactos seleccionados
                const newGroupContainer = generateGroupContainer(selectedContacts);
    
                // Añadir el nuevo contenedor del grupo al contenedor de usuarios en formGroup
                const containerUsers = $(".container-users");
                containerUsers.empty(); // Limpiar el contenedor antes de agregar nuevos contactos
                containerUsers.append(newGroupContainer.html());
            });
        });
    }

    // setInterval(loadFriends(), 30000); // que lo haga cada x minutos, asi se refrescan los mensajes    

    window.addEventListener('resize', () => {
        updateDOM(generateSearchBar().html(), searchBar);
        if (window.innerWidth > 768) {
            searchBar.empty()
            $(".contacts").removeClass("hidden").addClass("block");
            $(".chats").removeClass("block").addClass("hidden md:block sm:hidden");
            loadFriends();
        }
    });

    function initialize() {
        loadFriends();
        settingsFunctions();
        $(".contact-button")[0].addEventListener('click', () => contacts(user.username));
        chats();
    }

    // TODO QUITAR
    // TODO QUITAR
    // TODO QUITAR
    // TODO QUITAR
    setDarkMode();
    initialize();
    return;
}

// Function to initialize the page based on the current URL.
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