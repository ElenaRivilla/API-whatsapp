import { contacts } from "../tests/tests.js";
document.addEventListener("DOMContentLoaded", cargaDOM);

function cargaDOM() {
    generateChats();
}

function generateChats() {
    const chatContainer = $(".scrollbar-custom");

    const backBar= $("<div>").addClass("back-bar h-14 flex items-center");
    const backButton = $("<button>").addClass("p-2 bg-[#468FAF] rounded-full h-12 w-12 flex items-center justify-center");
    const backLink = $("<a>", { href: "./chatsList.html"});
    const backImg = $("<img>").addClass("h-5").attr("src", "../assets/svg/arrow.svg");
    backLink.append(backImg);
    backButton.append(backLink);
    const contactsTitle = $("<h3>").addClass("text-xl ml-4").text("Contactos");
    backBar.append(backButton, contactsTitle);

    const groupContainer = $("<div>").addClass("container-group flex h-12 my-4 mx-3 sm:w-1/8 sm:h-24 md:my-0 md:mb-5 md:mx-3 lg:mb-3 max-h-24 lg:h-20 sm:m-6 sm:mb-1 md:flex md:items-center");
    const groupImg = $('<img>').addClass('h-11').attr('src', '../assets/svg/add.svg');
    const groupName = $('<h2>').addClass('text-xl font-bold ml-3').text('Nuevo grupo');
    groupContainer.append(groupImg, groupName);

    const contactsName = $('<h2>').addClass('text-xl font-bold ml-3').text('Contactos');
    const separator = $("<hr>").addClass("border-t-2 border-[#468FAF] m-2 sm:mx-8 md:mx-4 lg:mt-4 lg:mx-4")

    chatContainer.append(backBar, groupContainer, contactsName, separator);

    contacts.forEach(chat => {
        const chatDiv = $("<div>").addClass("container-user flex h-12 my-4 mx-3 sm:w-1/8 sm:h-24 md:my-0 md:mb-5 md:mx-3 lg:mb-3 max-h-24 lg:h-20 sm:m-6 sm:mb-1 md:flex md:items-center");

        const containerImage = $("<div>").addClass("container-image w-40 h-16");
        const profileImage = $("<img>").addClass("profile-image sm:min-h-20 sm:min-w-20 md:max-w-20 lg:max-w-24 lg:max-h-22 min-h-14 min-w-14 max-h-14 max-w-14 rounded-full").attr("src", chat.imageUrl);
        containerImage.append(profileImage);

        const containerInfo = $("<div>").addClass("container-info truncate w-full h-20 p-0 md:p-0 lg:p-4");
        const username = $("<h3>").addClass("username text-base sm:text-2xl md:text-lg lg:text-lg font-bold block md:hidden lg:block").text(chat.username);
        const bio = $("<p>").addClass("message truncate block sm:block md:hidden lg:block").text(chat.bio);
        containerInfo.append(username).append(bio);

        chatDiv.append(containerImage).append(containerInfo);
        chatContainer.append(chatDiv);

        const hr = $("<hr>").addClass("border-t-2 border-[#468FAF] m-2 sm:mx-8 md:mx-4 lg:mt-5 lg:mx-4")
        chatContainer.append(hr);
    });
}