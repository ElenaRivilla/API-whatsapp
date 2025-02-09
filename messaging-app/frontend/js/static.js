document.addEventListener("DOMContentLoaded", cargaDOM);

function cargaDOM() {
    generateRightPanelFund();
}

function generateRightPanelFund() {

    const chatContainer = $(".chats").css("position", "relative");

    const messagesContainer = $(".messages-container").addClass("flex flex-col items-center justify-center")
    const imageSVG = $("<img>").addClass("h-28 mb-4").attr("src", "../assets/svg/dove.svg");
    const doveContainer = $("<h2>").addClass("mb-2 font-bold").text("Dove");
    const textContainer = $("<h2>").addClass("font-bold").text("Conversa sin límites, conecta con el mundo.");
    messagesContainer.append(imageSVG, doveContainer, textContainer);


    const footer = $("<div>").addClass("footer back-bar h-4 mb-3 flex items-center justify-center").css({
        "position": "absolute",
        "bottom": "0",
        "width": "100%",
        "z-index": "1000"
    });

    chatContainer.append(footer);

    const footerText = $("<p>").addClass("flex items-center justify-center h-full text-base mr-2 italic").text("Creado por la empresa TriCoded");
    const footerSVG = $("<img>").addClass("h-8").attr("src", "../assets/svg/logoCompany.svg");
    footer.append(footerText, footerSVG);
}