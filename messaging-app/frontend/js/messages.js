import { openChats, messages } from "../tests/tests.js";
document.addEventListener('DOMContentLoaded', cargaDOM);

function cargaDOM() {
    generateChats();
    generateMessages()
    changeRadius()

}

function changeRadius() {
    $(".message-container").each(function () {
        const content = $(this).find(".message-sender");
        const content2 = $(this).find(".message-receiver");
        if (content.length && content[0].scrollHeight > 40) {
            $(this).removeClass("rounded-full").addClass("rounded-xl");
        }
        if (content2.length && content2[0].scrollHeight > 40) {
            $(this).removeClass("rounded-full").addClass("rounded-xl");
        }
    });
}

function generateChats() {
    const chatContainer = $(".scrollbar-custom");

    openChats.forEach(chat => {
        const chatDiv = $("<div>").addClass("container-user flex h-12 my-4 mx-3 sm:w-1/8 sm:h-24 md:my-0 md:mb-5 md:mx-3 lg:mb-3 max-h-24 lg:h-20 sm:m-6 sm:mb-1 md:flex md:items-center");

        const containerImage = $("<div>").addClass("container-image w-40 h-16");
        const profileImage = $("<img>").addClass("profile-image sm:min-h-20 sm:min-w-20 md:max-w-20 lg:max-w-24 lg:max-h-22 min-h-14 min-w-14 max-h-14 max-w-14 rounded-full").attr("src", chat.imageUrl);
        containerImage.append(profileImage);

        const containerInfo = $("<div>").addClass("container-info truncate w-full h-20 p-0 md:p-0 lg:p-4");
        const username = $("<h3>").addClass("username text-base sm:text-2xl md:text-lg lg:text-lg font-bold block md:hidden lg:block").text(chat.username);
        const message = $("<p>").addClass("message truncate block sm:block md:hidden lg:block").text(chat.message);
        containerInfo.append(username).append(message);

        const dateContainer = $("<div>").addClass("flex flex-col justify-center items-center m-4 md:m-0");
        const date = $("<h5>").addClass("date").text(chat.time);
        dateContainer.append(date);

        chatDiv.append(containerImage).append(containerInfo).append(dateContainer);
        chatContainer.append(chatDiv);

        const hr = $("<hr>").addClass("border-t-2 border-[#468FAF] m-2 sm:mx-8 md:mx-4 lg:mt-5 lg:mx-4")
        chatContainer.append(hr);
    });
}

function generateMessages() {
    const messagesContainer = $(".messages-container");

    const infoFriend = $("<div>").addClass("info-friend h-24 flex-col items-center w-full block sticky top-0 bg-gray-100 z-10");
    const infoFriendInner = $("<div>").addClass("info-friend-inner h-24 flex items-center bg-gray-100 w-full block");
    const profileImage = $("<img>").attr("src", "https://picsum.photos/300/300?random=1").attr("alt", "Profile Image").addClass("w-16 mr-4 block sm:hidden md:hidden lg:hidden rounded-full");
    const friendName = $("<h3>").addClass("text-2xl font-bold ml-3 block").text("Alice Johnson");
    const hr = $("<hr>").addClass("border-t-2 border-[#468FAF] mx-8¡10 block");

    infoFriendInner.append(profileImage).append(friendName);
    infoFriend.append(infoFriendInner).append(hr);
    messagesContainer.append(infoFriend);

    const messagesWrapper = $("<div>").addClass("messages-wrapper mt-24"); // Add a wrapper with margin-top to avoid overlap

    messages.forEach(msg => {
        const article = $("<article>").addClass(`${msg.type}-container flex items-start mb-4 ${msg.type === "receiver" ? "justify-end" : ""} min-h-16 h-auto`);

        if (msg.type === "sender") {
            const figure = $("<figure>").addClass("image-sender hidden sm:block md:block lg:block mr-4 w-16 h-16");
            const img = $("<img>").attr("src", msg.imageUrl).attr("alt", "Sender Image").addClass("min-w-16 min-h-16 hidden sm:block md:block lg:block rounded-full");
            figure.append(img);

            const messageContainer = $("<div>").addClass("message-container w-auto max-w-[100%] min-h-16 h-auto bg-gray-200 p-4 px-7 rounded-full");
            const messageText = $("<p>").addClass("message-sender text-sm").text(msg.message);
            const time = $("<time>").addClass("hour-message w-[100%] pr-2 text-xs text-gray-500 ml-2 flex justify-end").text(msg.time);

            messageContainer.append(messageText).append(time);
            article.append(figure).append(messageContainer);
        } else {
            const messageContainer = $("<div>").addClass("message-container w-auto max-w-[100%] min-h-16 h-auto p-4 px-7 rounded-full").css("background-color", "#A9D6E5");
            const messageText = $("<p>").addClass("message-receiver text-sm").text(msg.message);

            const timeContainer = $("<div>").addClass("flex items-end w-full justify-end");
            const time = $("<time>").addClass("hour-message text-xs text-gray-500 ml-2").text(msg.time);
            const checkImage = $("<img>").attr("src", msg.checkImageUrl).attr("alt", "Check Message").addClass("w-4 h-4 ml-1");

            timeContainer.append(time).append(checkImage);
            messageContainer.append(messageText).append(timeContainer);
            article.append(messageContainer);
        }
        messagesWrapper.append(article);
    });

    messagesContainer.append(messagesWrapper);
    const sendMessageContainer = $("<div>").addClass("send-message-container p-5");
    const messageBar = $("<div>").addClass("message-bar");
    const form = $("<form>").attr("method", "post").addClass("flex items-center");
    const input = $("<input>").attr("type", "text").addClass("write-message h-16 flex-grow p-6 border border-gray-300 rounded-full").attr("placeholder", "Escribe un mensaje...");
    const button = $("<button>").attr("type", "submit").css("background-color", "#A9D6E5").addClass("send-button w-16 h-16 ml-4 p-2 text-white rounded-full");
    const img = $("<img>").addClass("w-10 ml-1.5").attr("src", "../assets/svg/send.svg");

    button.append(img);
    form.append(input).append(button);
    messageBar.append(form);
    sendMessageContainer.append(messageBar);
    $(".chats").append(sendMessageContainer);
}
