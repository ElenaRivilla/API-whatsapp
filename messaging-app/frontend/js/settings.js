

export function generateSettings(user) {
    const settingsContainer = $(".scrollbar-custom");

    const settingsBar = $('<div>').addClass('settings-bar h-14 flex items-center');
    const backButton = $('<button>').addClass('p-2 bg-[#468FAF] rounded-full h-12 w-12 flex items-center justify-center');
    const backLink = $('<a>');
    const backImg = $('<img>').addClass('h-5').attr('src', '../assets/svg/arrow.svg');
    backLink.append(backImg);
    backButton.append(backLink);

    const settingsTitle = $("<h3>").addClass("text-xl ml-4").text("Ajustes");
    settingsBar.append(backButton, settingsTitle);
    const profileContainer = $('<div>').addClass('profile-container h-24 flex items-center my-5');
    const contenedorUser = $('<div>').addClass('flex flex-col ml-6');
    const profileImg = $('<img>').addClass('h-16 rounded-full').attr('src', user.image);
    const profileName = $('<h2>').addClass('text-xl font-bold ').text(user.username);
    const profileBio = $("<p>").addClass("text-sm w-56 sm:w-62 md:w-62 truncate").text(user.bio);
    contenedorUser.append(profileName, profileBio);
    profileContainer.append(profileImg, contenedorUser);

    const separator = $("<hr>").addClass("border-t-2 border-[#468FAF] mx-9 mb-6");
    const listSettings = $("<div>").addClass("list-settings flex h-auto");
    const settingsList = $("<ul>").addClass("flex flex-col h-full space-y-6");

    const settingsItems = [
        { imgSrc: "../assets/svg/profile.svg", text: "Cuenta" },
        { imgSrc: "../assets/svg/padlock.svg", text: "Privacidad" },
        { imgSrc: "../assets/svg/chatBlue.svg", text: "Chats" },
        { imgSrc: "../assets/svg/notifications.svg", text: "Notificaciones" },
        { imgSrc: "../assets/svg/help.svg", text: "Ayuda" },
        { imgSrc: "../assets/svg/logout.svg", text: "Cerrar sesión", imgClass: "h-9 ml-1" }
    ];

    settingsItems.forEach(item => {
        const button = $("<button>");
        const listItem = $("<li>").addClass("flex items-center").attr("id", item.text);
        const img = $("<img>").addClass(item.imgClass || "h-10").attr("src", item.imgSrc);
        const text = $("<h2>").addClass("ml-4 text-xl").text(item.text);
        listItem.append(img, text);
        button.append(listItem);
        settingsList.append(button);
    });

    listSettings.append(settingsList);
    settingsContainer.append(settingsBar, profileContainer, separator, listSettings);
    return settingsContainer;
}

export function accountSettings() {
    const rightContainer = $(".chats");
    const accountContainer = $("<div>").addClass("account-settings p-6");
    const title = $("<h2>").addClass("text-2xl font-bold mb-4").text("Configuración de Cuenta");

    const nameLabel = $("<label>").addClass("block text-lg font-medium mb-2").text("Nombre");
    const nameInput = $("<input>").addClass("w-full p-2 border rounded").attr("type", "text").attr("placeholder", "Nuevo nombre");
    nameLabel.append(nameInput);

    const bioLabel = $("<label>").addClass("block text-lg font-medium mb-2 mt-4").text("Bio");
    const bioInput = $("<textarea>").addClass("w-full p-2 border rounded").attr("placeholder", "Nueva bio");
    bioLabel.append(bioInput);

    const label = $("<label>").addClass("relative inline-block w-20 h-8");
    const span = $("<span>").addClass("relative inline-block font-medium w-40 h-8").text("Cambiar modo");
    const inputCheck = $("<input>").addClass("sr-only peer").attr("type", "checkbox");
    const modeDiv = $("<div>").addClass("w-20 h-full bg-gray-400 rounded-full cursor-pointer transition duration-300 peer-checked:bg-blue-600 peer-checked:before:translate-x-12 peer-checked:before:bg- before:content-[''] before:absolute before:top-1 before:left-1 before:bg-white before:w-6 before:h-6 before:rounded-full before:transition before:duration-300");
    label.append(inputCheck, modeDiv);
    span.append(label);
    accountContainer.append(title, nameLabel, bioLabel, span);
    rightContainer.append(accountContainer);
    return rightContainer;
}


export function privacitySettings(){

}


export function chatSettings(){
    const rightContainer = $(".chats");
    const accountContainer = $("<div>").addClass("account-settings p-6");
    const title = $("<h2>").addClass("text-2xl font-bold mb-4").text("Configuración de Chats");

    const label = $("<label>").addClass("relative inline-block w-20 h-8");
    const span = $("<span>").addClass("relative inline-block font-medium w-40 h-8").text("Cambiar modo");
    const inputCheck = $("<input>").addClass("sr-only peer").attr("type", "checkbox");
    const modeDiv = $("<div>").addClass("w-20 h-full bg-gray-400 rounded-full cursor-pointer transition duration-300 peer-checked:bg-blue-600 peer-checked:before:translate-x-12 peer-checked:before:bg- before:content-[''] before:absolute before:top-1 before:left-1 before:bg-white before:w-6 before:h-6 before:rounded-full before:transition before:duration-300");
    label.append(inputCheck, modeDiv);
    span.append(label);
    accountContainer.append(title, span);
    rightContainer.append(accountContainer);
    return rightContainer;

}


export function notificationSettings(){

}

export function helpSettings(){

}

export function closeSession(){

}