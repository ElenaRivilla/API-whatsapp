import { contacts } from "../tests/tests.js";
document.addEventListener("DOMContentLoaded", cargaDOM);

function cargaDOM() {
    generateChats();
}

function generateChats() {
    const chatContainer = $(".scrollbar-custom");

    const backBar = $("<div>").addClass("back-bar h-14 flex items-center");
    const backButton = $("<button>").addClass("p-2 bg-[#468FAF] rounded-full h-12 w-12 flex items-center justify-center");
    const backLink = $("<a>", { href: "./chatsList.html" });
    const backImg = $("<img>").addClass("h-5").attr("src", "../assets/svg/arrow.svg");
    backLink.append(backImg);
    backButton.append(backLink);
    const contactsTitle = $("<h3>").addClass("text-xl ml-4").text("Nuevo chat");
    backBar.append(backButton, contactsTitle);

    const searchBar = $('<div>').addClass("container-search flex items-center p-2 rounded-md my-4 mx-3 sm:my-3 md:my-3 lg:my-3");
    const searchWrapper = $('<div>').addClass("relative w-full flex items-center");
    const searchInput = $('<input>').addClass("input-search flex-grow h-10 w-full rounded-full pl-10 border focus:border-[#468FAF] focus:ring-0").attr("type", "search").attr("placeholder", "Buscar contactos...");
    const searchIcon = $("<img>").addClass("h-5 absolute left-3").attr("src", "../assets/svg/search.svg");
    searchWrapper.append(searchInput, searchIcon);
    searchBar.append(searchWrapper);

    const groupContainer = $("<div>").addClass("container-group flex items-center h-12 my-4 mx-3 sm:w-1/8 sm:h-5 md:my-0 md:my-3 md:mx-3 lg:mb-3 max-h-12 lg:h-20 sm:my-6 md:flex md:items-center");
    const groupName = $('<h2>').addClass('text-base sm:text-2xl md:text-lg lg:text-lg font-bold block lg:block').text('Nuevo grupo');

    $.get('../assets/svg/add.svg', function(data) {
        const svg = $(data).find('svg');
        svg.removeAttr('width height'); // Quitar el atributo width del SVG
        svg.addClass('h-10 mr-3'); // Añadir clase al SVG
        // Eliminar el elemento <circle>
        svg.find('circle').removeAttr('stroke');
        groupContainer.append(svg).append(groupName);
    }, 'xml');

    
    const contactsName = $('<h2>').addClass('text-xl font-bold ml-3').text('Contactos');
    const separator = $("<hr>").addClass("border-t-2 border-[#468FAF] m-2 sm:mx-8 md:mx-4 lg:mt-4 lg:mx-4")

    chatContainer.append(backBar, searchBar, groupContainer, contactsName, separator);

    contacts.forEach(chat => {
        const chatDiv = $("<div>").addClass("container-user flex h-12 my-4 mx-3 sm:w-1/8 sm:h-24 md:my-0 md:mb-5 md:mx-3 lg:mb-3 max-h-24 lg:h-20 sm:m-6 sm:mb-1 md:flex sm:items-center md:items-center lg:items-center");

        const containerImage = $("<div>").addClass("container-image w-20 h-20 sm:w-28 sm:h-28 md:w-20 md:h-20 ");
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