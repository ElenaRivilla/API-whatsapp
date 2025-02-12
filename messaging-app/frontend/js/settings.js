import { backgroundColor, accentColor, receivedMsg, textBar } from "./static.js";
export function generateSettings(user) {
    const html = $("<div>");
    const settingsBar = $('<div>').addClass('settings-bar h-14 flex items-center');
    const backButton = $('<button>').addClass(`back-button p-2 rounded-full h-12 w-12 flex items-center justify-center`).attr("style", "background-color: var(--send-button-color);");
    const backLink = $('<a>');
    const backImg = $('<img>').addClass('contrastIcon h-5').attr('src', '../assets/svg/arrow.svg');
    backLink.append(backImg);
    backButton.append(backLink);

    const settingsTitle = $("<h3>").addClass("text-xl ml-4").text("Ajustes");
    settingsBar.append(backButton, settingsTitle);
    const profileContainer = $('<div>').addClass('profile-container h-24 flex items-center my-5');
    const contenedorUser = $('<div>').addClass('flex flex-col ml-6 w-42');
    const profileImg = $('<img>').addClass('h-16 rounded-full').attr('src', user.image);
    const profileName = $('<h2>').addClass('text-xl font-bold w-42').text(user.username);
    const profileBio = $("<p>").addClass("text-sm w-56 sm:w-62 md:min-w-30 truncate").text(user.bio);
    contenedorUser.append(profileName, profileBio);
    profileContainer.append(profileImg, contenedorUser);

    const separator = $("<hr>").addClass("border-t-2 mx-9 mb-6").attr("style", "border-color: var(--background-color);");
    const listSettings = $("<div>").addClass("list-settings flex h-auto");
    const settingsList = $("<ul>").addClass("flex flex-col h-full space-y-6");

    const settingsItems = [
        { imgSrc: "../assets/svg/profile.svg", text: "Cuenta", id: "account"},
        { imgSrc: "../assets/svg/padlock.svg", text: "Privacidad", id: "privacy"},
        { imgSrc: "../assets/svg/chatBlue.svg", text: "Chats", id: "chats"},
        { imgSrc: "../assets/svg/notifications.svg", text: "Notificaciones", id: 'notifications'},
        { imgSrc: "../assets/svg/help.svg", text: "Ayuda", id: 'help'},
        { imgSrc: "../assets/svg/logout.svg", text: "Cerrar sesión", imgClass: "h-9 ml-1", id: 'logout'}
    ];

    settingsItems.forEach(item => {
        const button = $("<button>");
        const listItem = $("<li>").addClass("flex items-center").attr({"text": item.text, 'id': item.id});
        const img = $("<img>").addClass(item.imgClass || "h-10").attr({"src": item.imgSrc, 'style': "color: var(--background-color);"});
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
    const accountContainer = $("<div>").addClass("account-settings p-10");
    const title = $("<h2>").addClass("text-2xl font-bold mb-4").text("Configuración de Cuenta");
    accountContainer.append(title);

    const imageContainer = $('<div>').addClass('input-image-container');
    const imageText = $('<p>').addClass('block text-lg font-medium mb-2 mt-4').text('Foto de perfil:');
    const img = $('<img>').addClass('h-20 w-20 rounded-full').attr("src", user.image);
    const fileInput = $('<input>').attr("type", "file").attr("accept", "image/*").addClass('hidden');
    imageContainer.append(imageText, fileInput, img);

    const nameContainer = $('<div>');
    const nameLabel = $("<label>").addClass("block text-lg font-medium mb-2").text("Nombre");
    const nameInput = $("<input>").addClass(`w-full p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[${accentColor}] focus:border-[${accentColor}] bg-[${textBar}]`).attr("type", "text").attr("placeholder", "Nuevo nombre");
    nameContainer.append(nameLabel, nameInput);

    const bioContainer = $('<div>');
    const bioLabel = $("<label>").addClass("block text-lg font-medium mb-2 mt-4").text("Biografia");
    const bioInput = $("<textarea>").addClass(`w-full p-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[${accentColor}] focus:border-[${accentColor}] bg-[${textBar}]`).attr("placeholder", "Nueva bio");
    bioContainer.append(bioLabel, bioInput);
    accountContainer.append(imageContainer, nameContainer, bioContainer);
    html.append(accountContainer);
    return html;
}

export function privacitySettings(){

}

export function chatSettings(){
    const html = $("<div>");
    const accountContainer = $("<div>").addClass("account-settings p-6");
    const title = $("<h2>").addClass("text-2xl font-bold mb-4").text("Configuración de Chats");

    const label = $("<label>").addClass("relative inline-block w-20 h-8");
    const span = $("<span>").addClass("relative inline-block font-medium w-40 h-8").text("Cambiar modo");
    const inputCheck = $("<input>").addClass("sr-only peer rounded").attr("type", "checkbox");
    const modeDiv = $("<div>").addClass(`modeChanger w-20 h-full rounded-full cursor-pointer transition duration-300 bg-[${accentColor}] peer:checked:bg-[${accentColor}] peer-checked:before:translate-x-12 peer-checked:before:bg- before:content-[''] before:absolute before:top-1 before:left-1 before:bg-white before:w-6 before:h-6 before:rounded-full before:transition before:duration-300`);
    label.append(inputCheck, modeDiv);
    span.append(label);
    accountContainer.append(title, span);
    html.append(accountContainer);
    return html;
}

export function notificationSettings(){

}

export function helpSettings(){

}

export function closeSession(url){
    document.cookie = "token= expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict";
    document.cookie = "user= expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict";

    window.location.href = url;
}