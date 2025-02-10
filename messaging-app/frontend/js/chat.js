export function generateChats(chats){
    const html = $("<div>");
    let chatDiv, containerImage, profileImage, containerInfo, username, message, dateContainer, date, hr;

    for (let chat of chats) {
        chatDiv = $("<div>").addClass("container-user flex h-12 my-4 mx-3 sm:w-1/8 sm:h-24 md:my-0 md:mb-5 md:mx-3 lg:mb-3 max-h-24 lg:h-20 sm:m-6 sm:mb-1 md:flex md:items-center");
        containerImage = $("<div>").addClass("container-image w-40 h-16");
        profileImage = $("<img>").addClass("profile-image sm:min-h-20 sm:min-w-20 md:max-w-20 lg:max-w-24 lg:max-h-22 min-h-14 min-w-14 max-h-14 max-w-14 rounded-full").attr("src", chat['imageUrl']);
        containerImage.append(profileImage);

        containerInfo = $("<div>").addClass("container-info text-sm truncate w-full h-20 p-0 md:p-0 lg:p-4");
        username = $("<h3>").addClass("username text-base text-lg sm:text-2xl md:text-lg lg:text-lg font-bold block md:hidden lg:block").text(chat['username']);
        message = $("<p>").addClass("message truncate block sm:block md:hidden lg:block").text(chat['message']);
        containerInfo.append(username).append(message);

        dateContainer = $("<div>").addClass("flex flex-col justify-center items-center m-4 md:m-0");
        date = $("<h5>").addClass("date text-sm").text(chat.time);
        dateContainer.append(date);

        chatDiv.append(containerImage).append(containerInfo).append(dateContainer);
        html.append(chatDiv);

        hr = $("<hr>").addClass("border-t-2 border-[#468FAF] m-2 sm:mx-8 md:mx-4 lg:mt-5 lg:mx-4");
        html.append(hr);
    }
    return html;
}

export function generateChat(messages, user){
    const html = $("<div>").addClass("flex flex-col h-full");
    const chats = $(".chats");
    const messagesContainer = generateMessages(messages, user);
    const chatBar = generateChatBar();
    
    html.append(messagesContainer);
    if (!chats.find(".message-bar").length) {
        chats.append(chatBar);
    }
    return html;
}

function generateMessages(messages, user){
    const html = $("<div>").addClass("h-[90%] w-full lex-1");
    let infoFriend = $("<div>").addClass("info-friend h-24 flex-col items-center w-full sticky top-0 bg-gray-100 z-10");
    let infoFriendInner = $("<div>").addClass("info-friend-inner h-24 flex items-center bg-gray-100 w-full");
    let backButton = $('<button>').addClass('p-2 bg-[#468FAF] rounded-full h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center mr-5 block sm:hidden md:hidden');
    let backLink = $('<a>').attr('href', './chatsList.html').addClass('flex items-center justify-center w-full h-full');
    let backImg = $('<img>').addClass('h-5').attr('src', '../assets/svg/arrow.svg');
    let profileImage = $("<img>").attr("src", "https://picsum.photos/300/300?random=1").attr("alt", "Profile Image").addClass("w-16 sm:mr-4 rounded-full");
    let friendName = $("<h3>").addClass("text-xl sm:text-2xl font-bold ml-3").text(user);
    let hr = $("<hr>").addClass("border-t-2 border-[#468FAF] mx-8 block");

    backLink.append(backImg);
    backButton.append(backLink);
    infoFriendInner.append(backButton).append(profileImage).append(friendName);
    infoFriend.append(infoFriendInner).append(hr);
    html.append(infoFriend);

    let messagesWrapper = $("<div>").addClass("messages-wrapper mt-0 sm:mt-24");
    let article, figure, senderImg, messageContainer, messageText, time, timeContainer, checkImage;

    for (let msg of messages) {
        article = $("<article>").addClass(`${msg['username'] === user ? "sender" : "receiver"}-container flex items-start mb-4 ${msg['username'] === user ? "" : "justify-end"} min-h-16 h-auto`);

        if (msg['username'] === user) {
            figure = $("<figure>").addClass("image-sender hidden sm:hidden md:block lg:block mr-4 w-16 h-16");
            senderImg = $("<img>").attr("src", msg['imageUrl']).attr("alt", "Sender Image").addClass("min-w-16 min-h-16 hidden sm:hidden md:block lg:block rounded-full");
            figure.append(senderImg);

            messageContainer = $("<div>").addClass("message-container w-auto max-w-[100%] min-h-16 h-auto bg-gray-200 p-4 px-7 rounded-full");
            messageText = $("<p>").addClass("message-sender text-xs text-sm").text(msg['body']);
            time = $("<time>").addClass("hour-message w-[100%] pr-2 text-xs text-gray-500 ml-2 flex justify-end").text(msg['date']);

            messageContainer.append(messageText).append(time);
            article.append(figure).append(messageContainer);
        } else {
            messageContainer = $("<div>").addClass("message-container w-auto max-w-[100%] min-h-16 h-auto p-4 px-7 rounded-full").css("background-color", "#A9D6E5");
            messageText = $("<p>").addClass("message-receiver text-xs sm:text-sm").text(msg['body']);

            timeContainer = $("<div>").addClass("flex items-end w-full justify-end");
            time = $("<time>").addClass("hour-message text-xs text-gray-500 ml-2").text(msg['date']);
            checkImage = $("<img>").attr("src", "../assets/svg/double-check-blue.svg").attr("alt", "Check Message").addClass("w-4 h-4 ml-1");

            timeContainer.append(time).append(checkImage);
            messageContainer.append(messageText).append(timeContainer);
            article.append(messageContainer);
        }
        messagesWrapper.append(article);
    };
    html.append(messagesWrapper);
    // Desplazar el contenedor hacia abajo
    setTimeout(() => {
        const container = $(".messages-container");
        container.scrollTop(container[0].scrollHeight);
    }, 0);
    return html;
}

function generateChatBar(){
    const sendMessageContainer = $("<div>").addClass("p-6 sm:p-5 w-full md:px-4 md:pb-4 bottom-0 bg-transparent p-0 rounded-full");
    const messageBar = $("<div>").addClass("message-bar");
    const form = $("<form>").attr("method", "post").addClass("flex items-center");
    const input = $("<input>").attr("type", "text").addClass("write-message h-12 sm:h-16 flex-grow p-4 sm:p-6 border border-gray-300 rounded-full").attr("placeholder", "Escribe un mensaje...");
    const button = $("<button>").attr("type", "submit").css("background-color", "#A9D6E5").addClass("send-button h-10 w-10 sm:w-16 sm:h-16 ml-2 sm:ml-4 p-2 text-white flex items-center justify-center rounded-full");
    const img = $("<img>").addClass("w-10 ml-1 sm:ml-1.5").attr("src", "../assets/svg/send.svg");

    button.append(img);
    form.append(input).append(button);
    messageBar.append(form);
    sendMessageContainer.append(messageBar);
    return sendMessageContainer;
}