import { contacts } from "../tests/tests.js";
document.addEventListener("DOMContentLoaded", cargaDOM);

function cargaDOM() {
    generateContactsGroup();
}

export function generateContactsGroup() {

    const chatContainer = $(".scrollbar-custom");
    const buttonContainer = $(".nextButtonGroup-custom");
    

    const backBar = $("<div>").addClass("back-bar h-14 flex items-center");
    const backButton = $("<button>").addClass("back-button-contact p-2 bg-[#468FAF] rounded-full h-12 w-12 flex items-center justify-center");
    const backLink = $("<a>", { href: "./home.html" });
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

    
    const contactsName = $('<h2>').addClass("text-xl font-bold ml-2 sm:ml-8 md:ml-4").text('Contactos');
    const separator = $("<hr>").addClass("separator border-t-2 border-[#468FAF] m-2 sm:mx-8 md:mx-4 lg:mt-4 lg:mx-4")

    chatContainer.append(backBar, searchBar, contactsName, separator);

    function renderContacts(allContacts) {
        chatContainer.find(".container-user, .contact-separator").remove(); // Eliminamos los contactos y los separadores.

        allContacts.forEach(contact => {
            const chatDiv = $("<div>").addClass("container-user flex h-18 my-2 mx-3 sm:w-1/8 sm:h-20 sm:m-2 md:my-0 md:mb-0 md:mx-3 lg:mb-0 max-h-24 lg:h-16 sm:mb-1 md:flex sm:items-center md:items-center lg:items-center");
    
            const containerImage = $("<div>").addClass("container-image w-20 h-20 sm:w-28 sm:h-28 md:w-20 md:h-14 flex justify-center items-center");
            const profileImage = $("<img>").addClass("profile-image sm:min-h-18 sm:min-w-18 md:max-w-20 lg:max-w-24 lg:max-h-22 min-h-14 min-w-14 max-h-14 max-w-14 rounded-full").attr("src", contact.imageUrl);
            containerImage.append(profileImage);
    
            const containerInfo = $("<div>").addClass("container-info truncate w-full p-2 h-20 md:p-1 lg:p-4 flex flex-col justify-center items-start");
            const username = $("<h3>").addClass("username text-base sm:text-2xl md:text-lg lg:text-lg font-bold block md:hidden lg:block").text(contact.username);
            const bio = $("<p>").addClass("message truncate block sm:block md:hidden lg:block text-xs w-56 sm:w-62 md:w-62 truncate").text(contact.bio);
            containerInfo.append(username).append(bio);
    
            chatDiv.append(containerImage).append(containerInfo);
            chatContainer.append(chatDiv);
    
            const hr = $("<hr>").addClass("contact-separator border-t-2 border-[#468FAF] m-1 sm:mx-8 sm:my-0.5 md:mx-4 md:my-4 lg:mt-4 lg:mx-4")
            chatContainer.append(hr);
        });
    }
   
    searchInput.on("input", function() { // La barra del buscador 
        const searchUser = $(this).val().toLowerCase(); // Recoge el string escrito en el input del buscador y lo convierte en minusculas.
        const filteredContacts = contacts.filter(contact => contact.username.toLowerCase().includes(searchUser)); // Filtra la lista original de contactos con el texto puesto en 'searchUser'.
        renderContacts(filteredContacts); // Actualizamos la lista de contactos con los contactos que coinciden con el texto introducido
    });
    renderContacts(contacts);


    





   /*  const groupContainer = $("<div>").addClass("container-group flex items-center justify-center h-12 sm:w-1/8 sm:h-5 md:my-0 md:my-3 md:mx-3 lg:mb-3 max-h-12 lg:h-20 sm:my-6 md:flex md:items-center md:justify-center");
    const nextButton = $("<button>").addClass("p-2 bg-[#468FAF] rounded-full h-12 w-12 flex items-center justify-center");
    const nextImg = $("<img>").addClass("h-5 transform rotate-180").attr("src", "../assets/svg/arrow.svg");
    const groupLink = $('<a>', { href: './createGroup.html' });
    groupLink.append(nextImg);
    nextButton.append(groupLink)
    groupContainer.append(nextButton);

    buttonContainer.append(groupContainer); */
}

