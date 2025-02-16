import { backgroundColor, accentColor, receivedMsg, textBar, sendButton } from "./static.js";

export function generateSettings(user) {
    const html = $("<div>");
    const settingsBar = $('<div>').addClass('settings-bar h-14 flex items-center');
    const backButton = $('<button>').addClass(`back-button p-2 rounded-full h-12 w-12 flex items-center justify-center`).attr("style", "background-color: var(--send-button-color);");
    const backLink = $('<a>');
    const backImg = $('<img>').addClass('contrastIcon h-5').attr('src', '../assets/svg/arrow.svg').attr("alt", "back button");
    backLink.append(backImg);
    backButton.append(backLink);

    const settingsTitle = $("<h3>").addClass("text-xl ml-4").text("Ajustes");
    settingsBar.append(backButton, settingsTitle);
    const profileContainer = $('<div>').addClass('profile-container h-24 flex items-center my-5');
    const contenedorUser = $('<div>').addClass('flex flex-col ml-6 w-42');
    const profileImg = $('<img>').addClass('h-16 rounded-full').attr('src', user.image).attr("alt", "user image");
    const profileName = $('<h2>').addClass('text-xl font-bold w-42').text(user.username);
    const profileBio = $("<p>").addClass("text-sm w-56 sm:w-62 md:min-w-30 truncate").text(user.bio);
    contenedorUser.append(profileName, profileBio);
    profileContainer.append(profileImg, contenedorUser);

    const separator = $("<hr>").addClass("border-t-2 mx-9 mb-6").attr("style", "border-color: var(--background-color);");
    const listSettings = $("<div>").addClass("list-settings flex h-auto");
    const settingsList = $("<ul>").addClass("flex flex-col h-full space-y-6");

    const settingsItems = [
        { imgSrc: "../assets/svg/profile.svg", text: "Cuenta", id: "account" },
        { imgSrc: "../assets/svg/padlock.svg", text: "Privacidad", id: "privacy" },
        { imgSrc: "../assets/svg/chatBlue.svg", text: "Chats", id: "chats" },
        { imgSrc: "../assets/svg/notifications.svg", text: "Notificaciones", id: 'notifications' },
        { imgSrc: "../assets/svg/help.svg", text: "Ayuda", id: 'help' },
        { imgSrc: "../assets/svg/logout.svg", text: "Cerrar sesión", imgClass: "h-9 ml-1", id: 'logout' }
    ];

    settingsItems.forEach(item => {
        const button = $("<button>");
        const listItem = $("<li>").addClass("flex items-center").attr({ "text": item.text, 'id': item.id });
        const img = $("<img>").addClass(item.imgClass || "h-10").attr({ "src": item.imgSrc, 'style': "color: var(--background-color);" }).attr("alt", "settings");
        const text = $("<h2>").addClass("ml-4 text-xl").text(item.text);
        listItem.append(img, text);
        button.append(listItem);
        settingsList.append(button);
    });

    listSettings.append(settingsList);
    html.append(settingsBar, profileContainer, separator, listSettings);
    return html;
}
// TODO INCOMPLETO!
export function accountSettings(user) {
    const html = $("<div>");
    const profileContainer = $('<div>').addClass('profile-container overflow-y-auto custom-scrollbar w-full h-[85%] p-6 flex flex-col md:flex-row');
    const profileImgContainer = $('<div>').addClass('image-container flex flex-col items-center md:items-start md:w-1/5 mb-6 mr-2');
    const profileTitle = $('<h2>').addClass('font-bold 2xl:text-xl xl:text-lg lg:text-base').text('Foto de perfil');
    const profileSeparator = $('<hr>').addClass(`my-3 border-t-2 border-[${backgroundColor}] w-[65%]`);
    const profileImg = $('<img>').addClass('rounded-full 2xl:h-44 mb-4 xl:h-36 lg:h-28 md:h-20').attr('src', user.image).attr("alt", "user image");;
    profileImgContainer.append(profileTitle, profileSeparator, profileImg);

    const infoContainer = $('<div>').addClass('profile-info flex flex-col w-full md:w-4/4');
    const labelName = $('<label>').addClass('my-4');
    const titleName = $('<h3>').addClass('text-md font-bold').text('Nombre');
    const separatorName = $('<hr>').addClass(`my-3 border-t-2 border-[${backgroundColor}] w-[45%]`);
    const errorMessageName = $('<p>').addClass('regexName-message text-red-500 mb-2 hidden absolute sm:absolute md:absolute').text('No admite números y máximo 50 carácteres.');
    const inputName = $('<input>').addClass(`input-name rounded-full focus:outline-none focus:ring-2 focus:ring-[${accentColor}] focus:border-[${accentColor}] h-10 w-[90%]`).attr('type', 'text').attr({'placeholder': 'Escribe tu nombre..', "style": "background-color: var(--typebar-color)"}).val(user.username);
    labelName.append(titleName, separatorName, inputName, errorMessageName,);

    const labelBio = $('<label>').addClass('my-4');
    const titleBio = $('<h3>').addClass('text-md font-bold').text('Biografía');
    const separatorBio = $('<hr>').addClass(`my-3 border-t-2 border-[${backgroundColor}] w-[45%]`);
    const errorMessageBio = $('<p>').addClass('regexBio-message text-red-500 mb-2 hidden absolute sm:absolute md:absolute').text('No admite más de 175 carácteres.');
    const textBio = $('<textarea>').addClass(`text-bio rounded-full focus:outline-none focus:ring-2 focus:ring-[${accentColor}] focus:border-[${accentColor}] h-10 w-[90%] resize-none overflow-y-auto scrollbar-hide`)
    .attr({'placeholder': 'Escribe una nueva biografía...', "style": "background-color: var(--typebar-color); max-height: 80px;"}).val(user.bio);


    labelBio.append(titleBio, separatorBio, textBio, errorMessageBio);
    infoContainer.append(labelName, labelBio);
    const sendContainer = $('<div>').addClass('flex flex-col items-center mt-4 relative');
    const message = $('<p>').addClass('send-message text-green-500 mb-2 hidden absolute bottom-[100%]').text('Perfil actualizado con éxito.');
    const sendButtonElement = $('<button>').addClass(`send-button btn bg-[${sendButton}] hover:bg-[${accentColor}] text-white py-2 px-4 rounded-full`).text('Guardar cambios');
    
    sendContainer.append(message, sendButtonElement);
    profileContainer.append(profileImgContainer, infoContainer);
    html.append(profileContainer, sendContainer);
    return html;
}

export function privacitySettings() {

}

export function chatSettings() {
    const html = $("<div>");
    const accountContainer = $("<div>").addClass("account-settings p-6");
    const title = $("<h2>").addClass("text-2xl font-bold mb-4").text("Configuración de Chats");

    const label = $("<label>").addClass("relative inline-block w-20 h-8");
    const span = $("<span>").addClass("relative inline-block font-medium w-40 h-8").text("Cambiar modo");
    const inputCheck = $("<input>").addClass("sr-only peer rounded").attr("type", "checkbox");
    const modeDiv = $("<div>").addClass(`modeChanger w-20 h-full rounded-full cursor-pointer transition duration-300 bg-[${sendButton}] peer:checked:bg-[${sendButton}] peer-checked:before:translate-x-12 peer-checked:before:bg- before:content-[''] before:absolute before:top-1 before:left-1 before:bg-white before:w-6 before:h-6 before:rounded-full before:transition before:duration-300`);
    label.append(inputCheck, modeDiv);
    span.append(label);
    accountContainer.append(title, span);
    html.append(accountContainer);
    return html;
}

export function notificationSettings() {

}

export function helpSettings() {

}

export function closeSession(url) {
    document.cookie = "token= expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict";
    document.cookie = "user= expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict";

    window.location.href = url;
}