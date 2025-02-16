import { backgroundColor, accentColor, containerColor } from "./static.js";

export function generateChats(chats) {
    const html = $("<div>");
    let chatDiv, containerImage, profileImage, containerInfo, username, message, dateContainer, date, hr;

    for (let chat of chats) {
        chatDiv = $("<div>").addClass("container-user flex h-18 my-2 mx-3 sm:w-1/8 sm:h-20 sm:m-2 md:my-0 md:mb-0 md:mx-3 lg:mb-0 max-h-24 lg:h-18 sm:mb-1 md:flex sm:items-center md:items-center lg:items-center").attr("role", "listitem");
        containerImage = $("<div>").addClass("container-image w-20 h-20 sm:w-28 sm:h-28 md:w-20 md:h-14 flex justify-center items-center");
        profileImage = $("<img>").addClass("profile-image h-20 w-20 sm:min-h-20 sm:min-w-20 md:max-w-20 lg:max-w-24 lg:max-h-22 min-h-11 min-w-11 max-h-16 max-w-16 rounded-full").attr("src", chat['imageUrl']).attr("alt", "profile image");
        containerImage.append(profileImage);

        containerInfo = $("<div>").addClass("container-info truncate w-full p-2 h-20 md:p-1 lg:p-4 flex flex-col justify-center items-start");
        username = $("<h3>").addClass("username text-base sm:text-2xl md:text-lg lg:text-lg font-bold block md:hidden lg:block").text(chat['username']).attr("aria-label", "Username");
        message = $("<p>").addClass("message truncate block text-sm sm:text-sm sm:block md:text-sm md:hidden lg:text-sm lg:block").text(chat['message']).attr("aria-label", "Message");
        containerInfo.append(username).append(message);

        dateContainer = $("<div>").addClass("flex flex-col justify-center items-center m-4 md:m-4");
        date = $("<h5>").addClass("date text-sm").text(chat.time).attr("aria-label", "Date");
        dateContainer.append(date);

        chatDiv.append(containerImage).append(containerInfo).append(dateContainer);
        html.append(chatDiv);

        hr = $("<hr>").addClass(`contact-separator border-t-2 m-1 sm:mx-8 sm:my-0.5 md:mx-4 md:my-4 lg:mt-4 lg:mx-4`).attr("style", 'border-color: var(--background-color)').attr("aria-hidden", "true");
        html.append(hr);
    }
    return html;
}

export function generateChat(response, user) {
    const html = $("<div>")
    html.append(generateMessages(response, user));
    html.append(generateChatBar());
    return html;
}

function generateMessages(response, user) {
    const html = $("<div>").addClass("messages-container overflow-y-auto custom-scrollbar w-full px-6 justify-center h-[85%]").attr("role", "log").attr("aria-live", "polite");
    let infoFriend = $("<div>").addClass("info-friend h-[10%] flex-col items-center w-full sticky top-0 z-10");
    let infoFriendInner = $("<div>").addClass("info-friend-inner h-24 flex items-center bg-gray-100 w-full").attr("style", "background-color: var(--container-color)");
    let backButton = $('<button>').addClass(`back-button p-2 rounded-full h-7 w-7 sm:h-12 sm:w-12 flex items-center justify-center mr-5 block sm:hidden md:hidden`).attr("style", "background-color: var(--background-color)").attr("aria-label", "Back");
    let backLink = $('<a>').addClass('back-button flex items-center justify-center w-full h-full');
    let backImg = $('<img>').addClass('w-3').attr('src', '../assets/svg/arrow.svg').attr("alt", "back button");
    let profileImage = $("<img>").attr("src", response['imageUrl']).attr("alt", "Profile Image").addClass("w-11 sm:w-16 md:w-[4'5rem] sm:mr-4 rounded-full");
    let friendName = $("<h3>").addClass("text-xl sm:text-2xl font-bold ml-3").text(user).attr("aria-label", "Friend Name");
    let hr = $("<hr>").addClass(`border-t-2 mx-8 block`).attr("style", "border-color: var(--background-color)").attr("aria-hidden", "true");

    backLink.append(backImg);
    backButton.append(backLink);
    infoFriendInner.append(backButton).append(profileImage).append(friendName);
    infoFriend.append(infoFriendInner).append(hr);
    html.append(infoFriend);

    let messagesWrapper = $("<div>").addClass("messages-wrapper mt-14 sm:mt-16");
    let article, figure, senderImg, messageContainer, messageText, time, timeContainer, checkImage;

    for (let msg of response['messages']) {
        article = $("<article>").addClass(`${msg['username'] === user ? "sender" : "receiver"}-container flex items-start mb-4 ${msg['username'] === user ? "" : "justify-end"} min-h-16 h-auto`).attr("role", "listitem");

        if (msg['username'] === user) {
            messageContainer = $("<div>").addClass("message-container w-auto max-w-[100%] min-h-16 h-auto p-4 px-7 rounded-full").attr("style", "background-color: var(--received-msg-color);");
            messageText = $("<p>").addClass("message-sender text-xs sm:text-sm w-full break-words").text(msg['body']).attr("aria-label", "Message");
            time = $("<time>").addClass("hour-message w-[100%] pr-2 text-xs ml-2 flex justify-end").text(msg['date']).attr("style", "color: var(--text-color);").attr("aria-label", "Time");

            messageContainer.append(messageText).append(time);
            article.append(figure).append(messageContainer);
        } else {
            messageContainer = $("<div>").addClass("message-container w-auto max-w-[100%] min-h-16 h-auto p-4 px-7 rounded-full").attr("style", "background-color: var(--sent-msg-color);");
            messageText = $("<p>").addClass("message-receiver text-xs sm:text-sm w-full break-words").text(msg['body']).attr("aria-label", "Message");

            timeContainer = $("<div>").addClass("flex items-end w-full justify-end");
            time = $("<time>").addClass("hour-message text-xs sm:text-sm ml-2").text(msg['date']).attr("style", "color: var(--text-color);").attr("aria-label", "Time");
            switch (msg['status']) {
                case "sent":
                    checkImage = $("<img>").attr("src", "../assets/svg/check.svg").attr("alt", "Check Message").addClass("w-4 h-4 ml-1");
                    break;
                case "received":
                    checkImage = $("<img>").attr("src", "../assets/svg/double-check.svg").attr("alt", "Check Message").addClass("w-4 h-4 ml-1");
                    break;
                case "seen":
                    checkImage = $("<img>").attr("src", "../assets/svg/double-check-blue.svg").attr("alt", "Check Message").addClass("w-4 h-4 ml-1");
                    break;
                default:
                    break;
            }
            timeContainer.append(time).append(checkImage);
            messageContainer.append(messageText).append(timeContainer);
            article.append(messageContainer);
        }
        messagesWrapper.append(article);
    };
    html.append(messagesWrapper);
    return html;
}

function generateChatBar() {
    const sendMessageContainer = $("<div>").addClass("send-container p-6 absolute bottom-0 sm:p-0 w-full md:px-4 md:pb-4 bg-transparent p-0 rounded-full h-[15%] flex justify-end flex-col");
    const messageBar = $("<div>").addClass("message-bar");
    const form = $("<form>").attr("method", "post").addClass("textBarForm flex items-center").attr("aria-label", "Send Message Form");
    const input = $("<input>").attr("type", "text").addClass(`write-message h-12 sm:h-16 flex-grow p-4 sm:p-6 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[${accentColor}] focus:border-[${accentColor}]`).attr({ "placeholder": "Escribe un mensaje...", "style": "background-color: var(--typebar-color)", "aria-label": "Write a message" });
    const button = $("<button>").attr({ "type": "submit", "style": "background-color: var(--send-button-color)" }).addClass("send-button h-10 w-10 sm:w-16 sm:h-16 ml-2 sm:ml-4 p-2 text-white flex items-center justify-center rounded-full").attr("aria-label", "Send Message");
    const img = $("<img>").addClass("w-10 ml-1 sm:ml-1.5").attr("src", "../assets/svg/send.svg").attr("alt", "send icon");

    button.append(img);
    form.append(input).append(button);
    messageBar.append(form);
    sendMessageContainer.append(messageBar);
    return sendMessageContainer;
}

// export function changeRadius() {
//     // $(".message-container").each(function () {
//     //     if (this.scrollHeight > this.offsetHeight) {
//     //         $(this).removeClass("rounded-full").addClass("rounded-xl");
//     //     }
//     //     else{
//     //         $(this).removeClass("rounded-xl").addClass("rounded-full");
//     //     }
//     // });
//     $(".message-container").each(function () {
//         const child = this.children[0];
//         if (child.scrollHeight > child.offsetHeight) {
//             $(this).removeClass("rounded-full").addClass("rounded-xl");
//         } else {
//             $(this).removeClass("rounded-xl").addClass("rounded-full");
//         }
//     });
// }