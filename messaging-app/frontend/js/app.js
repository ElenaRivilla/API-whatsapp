// Import necessary modules for error handling and API interaction.
import { loginValid, SettingsAccountValidation, manageErrors } from "./errControl.js";
import { userExists, getUsersHome, getMessagesUser, getContacts, createGroup, sendMessage, updateUserProfile} from "./apiManager.js";
import { User } from "./user.js"
import { generateChats, generateChat } from "./chat.js";
import { generateSettings, accountSettings, privacitySettings, chatSettings, notificationSettings, helpSettings, closeSession } from "./settings.js";
import { generateRightPanelFund, generateSearchBar, setDarkMode, setLightMode, errorMessage } from "./static.js";
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
    let isAddGroupButtonClicked = false;

    if (window.innerWidth < 768) {
        updateDOM(generateSearchBar().html(), searchBar);
        searchBar.addClass("block");
    }

    function addEvents(node, event) {
        const buttons = node.find(".button-user");
        buttons.each(function () {
            $(this).on("click", () => {
                event(getUsernameFromNode(this));
            });
        });
    }

    function getUsernameFromNode(node) {
        return node.querySelector(".username").innerText;
    }

    // TODO revisar
    async function loadChat(user2, fisrtTime = true) {
        try {
            // Carga los 10 mensajes entre el usuario anfitrion y el usuario amigo (reciever_id).
            await loadMessages(user.username, user2, 10, fisrtTime);
            const chat = $(".messages-container");

            if (window.innerWidth < 768) {
                const container = $(".container-user");
                container.on("click", () => {
                });
                $(".contacts").removeClass("block").addClass("hidden");
                $(".chats").removeClass("hidden md:block sm:hidden").css('display', '');
                header.removeClass("block").addClass("hidden");
            }

            let scrollTimeOut;
            chat[0].addEventListener('scroll', () => {
                clearTimeout(scrollTimeOut);
                if (chat[0].scrollTop === 0) {
                    scrollTimeOut = setTimeout(() => {
                        loadMessages(user.username, user2, 20, false);
                    }, 500);
                }
            });

            if (fisrtTime) {
                // Desplazar el contenedor hacia abajo
                setTimeout(() => {
                    chat.scrollTop(chat[0].scrollHeight);
                }, 0);
            }

            await loadFriends(false);
            return;
        } catch (error) {
            manageErrors(error);
        }
    }

    async function loadFriends(fade = true) {
        // Carga todos la lista de amigos del usuario
        try {
            const response = await getUsersHome();
            const chats = generateChats(response.contacts); // Genera los chats.
            updateDOM(chats.html(), leftContainer);  // Actualiza el DOM con los chats generados.
            if (fade) {
                leftContainer.hide().fadeIn(400);  // Añade un efecto de fadeIn al contenedor izquierdo.
            }
            addEvents(leftContainer, loadChat); // Añade los eventos en el panel izquierdo al hacer click sobre un contacto.
        } catch (error) {
            manageErrors(error);
        }
    }

    function updateDOM(html, section) {
        section.empty(); // Limpiar el contenedor antes de agregar nuevos chats
        section.html(html);
        return;
    }

    async function loadMessages(user1, user2, loadSize, fade = true) {
        try {
            const response = await getMessagesUser(user1, user2, loadSize);
            updateDOM(generateChat(response, user2).html(), rightContainer);
            if (fade) {
                rightContainer.hide().fadeIn(400);  // Añade un efecto de fadeIn al contenedor izquierdo.
            }
            user.setOpenChat(user2);
            //changeRadius();
            if (window.innerWidth < 768) {
                const backContainer = $(".back-button");
                backContainer.on("click", () => {
                    $(".contacts").removeClass("hidden").addClass("block");
                    $(".chats").removeClass("block").addClass("hidden md:hidden sm:hidden");
                    header.removeClass("hidden").addClass("block sm:block");
                });
            }
            $('.textBarForm')[0].addEventListener("submit", function (event) {
                event.preventDefault();  // Prevent the default form submission (page reload).
                send(user2);
            });
        }
        catch (error) {
            manageErrors(error);
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
                await loadMessages(user.username, receiver, 10, false);
                setTimeout(() => {
                    const container = $(".messages-container");
                    container.scrollTop(container[0].scrollHeight);
                }, 0);
                await loadFriends(false);
            }
            catch (error) {
                manageErrors(error);
            }
        }
        return;
    }

    // La parte de Settings:
    function settingsFunctions() {
        if (window.innerWidth < 768) {
            header.removeClass("block").addClass("hidden");
        }
        updateDOM(generateSettings(user).html(), leftContainer);
        leftContainer.hide().fadeIn(400);  // Añade un efecto de fadeIn al contenedor izquierdo.

        $('.back-button')[0].addEventListener("click", () => {
            if (window.innerWidth < 768) {
                header.removeClass("hidden").addClass("block");
                $(".chats").removeClass("block").css('display', '');
            }
            if (!user.hasOpenChat) {
                updateDOM(generateRightPanelFund().html(), rightContainer);
                $(".chats").css('display', '');
                rightContainer.hide().fadeIn(400);
            }
            loadFriends();
        });

        $("#account")[0].addEventListener("click", async () => {
            const settingsHtml = accountSettings(user);
            rightContainer.hide().html(settingsHtml).fadeIn(400); // Asegura de que el contenedor derecho se actualiza correctamente
            user.setOpenChat(false);

            const message = $(".send-message")[0];

            const sendButton = $(".send-button")[0];
            sendButton.addEventListener("click", async (event) => {
                event.preventDefault(); // Previene el envío del formulario por defecto
                const newName = $('.input-name')[0].value;
                const newBio = $('.text-bio')[0].value;

                try {
                    await SettingsAccountValidation(newName, newBio);
                    const updateUser = {
                        username: newName,
                        bio: newBio,
                    };
                    const updatedUser = await updateUserProfile(updateUser);
                    user.updateProfile(updatedUser.username, updatedUser.bio);
                    document.cookie = "user=" + encodeURIComponent(user.toString()) + "; path=/; Secure; SameSite=Strict";
                    message.classList.remove('hidden');
                    setTimeout(() => { // TODO los botones del leftContainer dejan de funcionar al utilizar el segundo updateDOM.
                        updateDOM(generateRightPanelFund().html(), rightContainer);
                        settingsFunctions();
                    }, 3000);
                } catch (error) {
                    manageErrors(error);
                }
            });

        });

        //addSettingEvent($("#privacy")[0], privacitySettings, rightContainer);
        $("#chats")[0].addEventListener('click', () => {
            updateDOM(chatSettings().html(), rightContainer);
            rightContainer.hide().fadeIn(400);
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
            leftContainer.hide().fadeIn(400);

            $(".add-group-button")[0].addEventListener("click", function () {
                $(".container-group").remove();
                updateDOM(formGroup(response.friends).html(), rightContainer);
                rightContainer.hide().fadeIn(400);
                isAddGroupButtonClicked = true;
                creationGroup();
                user.setOpenChat("");
            });

            $(document).on("click", ".back-button-contact", function () {
                header.removeClass("hidden").addClass("block");
                if (!user.hasOpenChat) {
                    updateDOM(generateRightPanelFund().html(), rightContainer);
                    rightContainer.hide().fadeIn(400);
                    $(".chats").css('display', '');
                }
                loadFriends();
            });
        } catch (error) {
            manageErrors(error);
        }
    }

    function chats() {
        $(".chat-button")[0].addEventListener("click", () => {
            if (!user.hasOpenChat) {
                loadFriends();
                updateDOM(generateRightPanelFund().html(), rightContainer);
                rightContainer.hide().fadeIn(400);
            }
        });
    }

    if (window.innerWidth < 768) {
        updateDOM(generateSearchBar().html(), searchBar);
        searchBar.addClass("block");
    }

    // Function to handle the creation of a group.
    function creationGroup() {
        // Check if the add group button was clicked.
        if (!isAddGroupButtonClicked) {
            return;
        }
        const selectedContacts = [];

        // Add click event to each user container.
        $(".container-user").each(function () {
            $(this).on("click", function () {
                $(this).fadeOut(200); // Fade out the user container.
                $(this).next(".contact-separator").remove(); // Remove the separator.

                // Extract attributes from the user container.
                const username = $(this).find(".username").text();
                const bio = $(this).find(".message").text();
                const imageUrl = $(this).find(".profile-image").attr("src");

                // Create an object with the extracted attributes.
                const contact = {
                    username: username,
                    bio: bio,
                    image: imageUrl
                };

                // Add the object to the selected contacts array.
                selectedContacts.push(contact);

                // Generate the group container with the selected contacts.
                const newGroupContainer = generateGroupContainer(selectedContacts);

                // Add the new group container to the users container in formGroup.
                const containerUsers = $(".container-users");
                containerUsers.empty(); // Clear the container before adding new contacts.
                containerUsers.append(newGroupContainer.html()).hide().fadeIn(400); // Append the new group container with fadeIn effect.
            });
        });
    }

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
        settingsButton.addEventListener("click", settingsFunctions);
        $(".contact-button")[0].addEventListener('click', () => contacts(user.username));
        chats();
    }

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