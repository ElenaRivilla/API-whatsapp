import { openChats, messages } from "../tests/tests.js";
document.addEventListener('DOMContentLoaded', cargaDOM);

function cargaDOM() {
    changeRadius();
    generateChats();
    generateMessages();
    
}

function changeRadius() {
    const messages = document.querySelectorAll(".message-container");

    messages.forEach((message) => {
        const content = message.querySelector(".message-sender");
        const content2 = message.querySelector(".message-receiver");
        if (content && content.scrollHeight > 40) {
            message.classList.remove("rounded-full");
            message.classList.add("rounded-2xl");
        }
        if (content2 && content2.scrollHeight > 40) {
            message.classList.remove("rounded-full");
            message.classList.add("rounded-2xl");
        }
    });
}

function generateChats(){
    const chatContainer = document.querySelector(".scrollbar-custom");
    
    openChats.forEach(chat => {
        const chatDiv = document.createElement("div");
        chatDiv.className = "container-user flex w-1/8 h-28 m-6";

        const containerImage = document.createElement("div");
        containerImage.className = "container-image w-44 m-2";

        const profileImage = document.createElement("img");
        profileImage.className = "profile-image h-24 rounded-full";
        profileImage.src = chat.imageUrl;
        containerImage.appendChild(profileImage);

        const containerInfo = document.createElement("div");
        containerInfo.className = "container-info truncate w-full p-4";

        const username = document.createElement("h3");
        username.className = "username text-2xl font-bold";
        username.textContent = chat.username;

        const message = document.createElement("p");
        message.className = "message truncate mt-2";
        message.textContent = chat.message;

        containerInfo.appendChild(username);
        containerInfo.appendChild(message);

        const dateContainer = document.createElement("div");
        dateContainer.className = "flex flex-col justify-center items-center m-4";
        const date = document.createElement("h5");
        date.className = "date";
        date.textContent = chat.time;
        dateContainer.appendChild(date);

        chatDiv.appendChild(containerImage);
        chatDiv.appendChild(containerInfo);
        chatDiv.appendChild(dateContainer);
        chatContainer.appendChild(chatDiv);

        const hr = document.createElement("hr");
        hr.className = "border-t-2 border-gray-900 mx-9";
        chatContainer.appendChild(hr);
    });
}

function generateMessages(){
    const messagesContainer = document.querySelector(".messages-container");

    messages.forEach(msg => {
        const article = document.createElement("article");
        article.className = `${msg.type}-container flex items-start mb-4 ${msg.type === "receiver" ? "justify-end" : ""} min-h-16 h-auto`;

        if (msg.type === "sender") {
            const figure = document.createElement("figure");
            figure.className = "image-sender mr-4 w-16 h-16";

            const img = document.createElement("img");
            img.src = msg.imageUrl;
            img.alt = "Sender Image";
            img.className = "min-w-16 min-h-16 rounded-full";
            figure.appendChild(img);

            const messageContainer = document.createElement("div");
            messageContainer.className = "message-container w-auto max-w-[100%] min-h-16 h-auto bg-green-100 p-4 px-7 rounded-full";

            const messageText = document.createElement("p");
            messageText.className = "message-sender text-sm";
            messageText.textContent = msg.message;

            const time = document.createElement("time");
            time.className = "hour-message w-[100%] pr-2 text-xs text-gray-500 ml-2 flex justify-end";
            time.textContent = msg.time;

            messageContainer.appendChild(messageText);
            messageContainer.appendChild(time);

            article.appendChild(figure);
            article.appendChild(messageContainer);
            
        } else {
            const messageContainer = document.createElement("div");
            messageContainer.className = "message-container w-auto max-w-[100%] min-h-16 h-auto bg-gray-200 p-4 px-7 rounded-full";

            const messageText = document.createElement("p");
            messageText.className = "message-receiver text-sm";
            messageText.textContent = msg.message;

            const timeContainer = document.createElement("div");
            timeContainer.className = "flex items-end w-full justify-end";

            const time = document.createElement("time");
            time.className = "hour-message text-xs text-gray-500 ml-2";
            time.textContent = msg.time;

            const checkImage = document.createElement("img");
            checkImage.src = msg.checkImageUrl;
            checkImage.alt = "Check Message";
            checkImage.className = "w-4 h-4 ml-1";

            timeContainer.appendChild(time);
            timeContainer.appendChild(checkImage);

            messageContainer.appendChild(messageText);
            messageContainer.appendChild(timeContainer);

            article.appendChild(messageContainer);
        }
        messagesContainer.appendChild(article);
    });
}