import { getUsersHome } from "./apiManager.js";
document.addEventListener('DOMContentLoaded', cargaDOM);

async function cargaDOM() {
    const userId = 1; // metemos el id manualmente hasta arreglar lo de las cookies para almacenar la información del usuario que ha iniciado sesión y recibirlo por ahí
    try {
        const response = await getUsersHome(userId);
        const users = response.contacts;
        generateChats(users);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

function generateChats(chats) {
    const chatContainer = $(".scrollbar-custom");
    chatContainer.empty(); // Limpiar el contenedor antes de agregar nuevos chats

    chats.forEach(chat => {
        console.log("Generating chat for:", chat); // Log each chat being generated

        const chatDiv = $("<div>").addClass("container-user flex h-12 my-4 mx-3 sm:w-1/8 sm:h-24 md:my-0 md:mb-5 md:mx-3 lg:mb-3 max-h-24 lg:h-20 sm:m-6 sm:mb-1 md:flex md:items-center");

        const containerImage = $("<div>").addClass("container-image w-40 h-16");
        const profileImage = $("<img>").addClass("profile-image sm:min-h-20 sm:min-w-20 md:max-w-20 lg:max-w-24 lg:max-h-22 min-h-14 min-w-14 max-h-14 max-w-14 rounded-full").attr("src", chat.imageUrl);
        containerImage.append(profileImage);

        const containerInfo = $("<div>").addClass("container-info text-sm truncate w-full h-20 p-0 md:p-0 lg:p-4");
        const username = $("<h3>").addClass("username text-base text-lg sm:text-2xl md:text-lg lg:text-lg font-bold block md:hidden lg:block").text(chat.username);
        const message = $("<p>").addClass("message truncate block sm:block md:hidden lg:block").text(chat.message);
        containerInfo.append(username).append(message);

        const dateContainer = $("<div>").addClass("flex flex-col justify-center items-center m-4 md:m-0");
        const date = $("<h5>").addClass("date text-sm").text(chat.time);
        dateContainer.append(date);

        chatDiv.append(containerImage).append(containerInfo).append(dateContainer);
        chatContainer.append(chatDiv);

        const hr = $("<hr>").addClass("border-t-2 border-[#468FAF] m-2 sm:mx-8 md:mx-4 lg:mt-5 lg:mx-4")
        chatContainer.append(hr);
    });
}