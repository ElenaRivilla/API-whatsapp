import { openChats, messages } from "../tests/tests.js";
import { getUsersHome, getMessagesUser } from "./apiManager.js";
import { friendsSite, messagesSite } from "./app.js";
document.addEventListener('DOMContentLoaded', cargaDOM);

async function cargaDOM() {
    try {
        const friends = await friendsSite();
        generateChats(friends);

        const messages = await messagesSite();
        generateMessages(messages);
        
    } catch (error) {
        console.error("Error: ", error);
    }
    changeRadius()
}

//poner en el módulo chat.js y borrar este módulo
function changeRadius() {
    $(".message-container").each(function () {
        let content = $(this).find(".message-sender");
        let content2 = $(this).find(".message-receiver");
        if (content.length && content[0].scrollHeight > 40) {
            $(this).removeClass("rounded-full").addClass("rounded-xl");
        }
        if (content2.length && content2[0].scrollHeight > 40) {
            $(this).removeClass("rounded-full").addClass("rounded-xl");
        }
    });
}

function generateChats(chats) {
    let chatContainer = $(".scrollbar-custom");
    chatContainer.empty(); // Limpiar el contenedor antes de agregar nuevos chats

    let chatDiv, containerImage, profileImage, containerInfo, username, message, dateContainer, date, hr;

    for (let chat of chats) {
        chatDiv = $("<div>").addClass("container-user flex h-12 my-4 mx-3 sm:w-1/8 sm:h-24 md:my-0 md:mb-5 md:mx-3 lg:mb-3 max-h-24 lg:h-20 sm:m-6 sm:mb-1 md:flex md:items-center");
        containerImage = $("<div>").addClass("container-image w-40 h-16");
        profileImage = $("<img>").addClass("profile-image sm:min-h-20 sm:min-w-20 md:max-w-20 lg:max-w-24 lg:max-h-22 min-h-14 min-w-14 max-h-14 max-w-14 rounded-full").attr("src", chat['imageUrl']).attr("alt", "profile image");;
        containerImage.append(profileImage);

        containerInfo = $("<div>").addClass("container-info text-sm truncate w-full h-20 p-0 md:p-0 lg:p-4");
        username = $("<h3>").addClass("username text-base text-lg sm:text-2xl md:text-lg lg:text-lg font-bold block md:hidden lg:block").text(chat['username']);
        message = $("<p>").addClass("message truncate block sm:block md:hidden lg:block").text(chat['message']);
        containerInfo.append(username).append(message);

        dateContainer = $("<div>").addClass("flex flex-col justify-center items-center m-4 md:m-0");
        date = $("<h5>").addClass("date text-sm").text(chat['time']);
        dateContainer.append(date);

        chatDiv.append(containerImage).append(containerInfo).append(dateContainer);
        chatContainer.append(chatDiv);

        hr = $("<hr>").addClass("border-t-2 border-[#468FAF] m-2 sm:mx-8 md:mx-4 lg:mt-5 lg:mx-4");
        chatContainer.append(hr);
    }
}

function generateMessages(messages) {
    console.log(messages)
    let messagesContainer = $(".messages-container");
    let infoFriend = $("<div>").addClass("info-friend h-24 flex-col items-center w-full block sticky top-0 bg-gray-100 z-10");
    let infoFriendInner = $("<div>").addClass("info-friend-inner h-24 flex items-center bg-gray-100 w-full block");
    let backButton = $('<button>').addClass('p-2 bg-[#468FAF] rounded-full h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center block sm:block md:hidden mr-5');
    let backLink = $('<a>').addClass('flex items-center justify-center w-full h-full');
    let backImg = $('<img>').addClass('h-5').attr('src', '../assets/svg/arrow.svg').attr("alt", "back button");;
    let profileImage = $("<img>").attr("src", "https://picsum.photos/300/300?random=1").attr("alt", "Profile Image").addClass("w-16  sm:mr-4 block sm:block md:hidden lg:hidden rounded-full");
    let friendName = $("<h3>").addClass("text-xl sm:text-2xl font-bold ml-3 block").text("Alice Johnson");
    let hr = $("<hr>").addClass("border-t-2 border-[#468FAF] mx-8¡10 block");

    backLink.append(backImg);
    backButton.append(backLink);
    infoFriendInner.append(backButton).append(profileImage).append(friendName);
    infoFriend.append(infoFriendInner).append(hr);
    messagesContainer.append(infoFriend);

    let messagesWrapper = $("<div>").addClass("messages-wrapper mt-0 sm:mt-24"); // Add a wrapper with margin-top to avoid overlap

    let article, figure, senderImg, messageContainer, messageText, time, timeContainer, checkImage;

    for (let msg of messages) {
        article = $("<article>").addClass(`${msg['sender_id'] === 1 ? "sender" : "receiver"}-container flex items-start mb-4 ${msg['sender_id'] === 1 ? "" : "justify-end"} min-h-16 h-auto`);

        if (msg['sender_id'] === 1) {
            figure = $("<figure>").addClass("image-sender hidden sm:hidden md:block lg:block mr-4 w-16 h-16");
            senderImg = $("<img>").attr("src", msg['imageUrl']).attr("alt", "Sender Image").addClass("min-w-16 min-h-16 hidden sm:hidden md:block lg:block rounded-full");
            figure.append(senderImg);

            messageContainer = $("<div>").addClass("message-container w-auto max-w-[100%] min-h-16 h-auto bg-gray-200 p-4 px-7 rounded-full");
            messageText = $("<p>").addClass("message-sender text-sm").text(msg['body']);
            time = $("<time>").addClass("hour-message w-[100%] pr-2 text-xs text-gray-500 ml-2 flex justify-end").text(msg['date']);

            messageContainer.append(messageText).append(time);
            article.append(figure).append(messageContainer);
        } else {
            messageContainer = $("<div>").addClass("message-container w-auto max-w-[100%] min-h-16 h-auto p-4 px-7 rounded-full").css("background-color", "#A9D6E5");
            messageText = $("<p>").addClass("message-receiver text-sm").text(msg['body']);

            timeContainer = $("<div>").addClass("flex items-end w-full justify-end");
            time = $("<time>").addClass("hour-message text-xs text-gray-500 ml-2").text(msg['date']);
            checkImage = $("<img>").attr("src", "../assets/svg/double-check-blue.svg").attr("alt", "Check Message").addClass("w-4 h-4 ml-1");

            timeContainer.append(time).append(checkImage);
            messageContainer.append(messageText).append(timeContainer);
            article.append(messageContainer);
        }
        messagesWrapper.append(article);
    };

    messagesContainer.append(messagesWrapper);
    let sendMessageContainer = $("<div>").addClass("send-message-container p-5");
    let messageBar = $("<div>").addClass("message-bar");
    let form = $("<form>").attr("method", "post").addClass("flex items-center");
    let input = $("<input>").attr("type", "text").addClass("write-message h-16 flex-grow p-6 border border-gray-300 rounded-full").attr("placeholder", "Escribe un mensaje...");
    let button = $("<button>").attr("type", "submit").css("background-color", "#A9D6E5").addClass("send-button w-16 h-16 ml-4 p-2 text-white rounded-full");
    let img = $("<img>").addClass("w-10 ml-1.5").attr("src", "../assets/svg/send.svg").attr("alt", "send button");

    button.append(img);
    form.append(input).append(button);
    messageBar.append(form);
    sendMessageContainer.append(messageBar);
    $(".chats").append(sendMessageContainer);
}