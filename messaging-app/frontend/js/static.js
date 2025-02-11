export function generateRightPanelFund() {

    const messagesContainer = $(".chats");

    const groupTextContainer = $("<div>").addClass("group-text-container flex flex-col items-center justify-center h-[95%]");
    const imageSVG = $("<img>").addClass("h-28 mb-4").attr("src", "../assets/svg/dove.svg");
    const doveContainer = $("<h2>").addClass("mb-2 font-bold").text("Dove");
    const textContainer = $("<h2>").addClass("font-bold").text("Conversa sin límites, conecta con el mundo.");
    groupTextContainer.append(imageSVG, doveContainer, textContainer);

    const footerContiner = $("<div>").addClass("footer back-bar h-4 mb-3 flex items-center justify-center bottom-0");

    messagesContainer.append(groupTextContainer, footerContiner);

    const footerText = $("<p>").addClass("flex items-center justify-center h-full text-base mr-2 italic").text("Creado por la empresa TriCoded");
    const footerSVG = $("<img>").addClass("h-8").attr("src", "../assets/svg/logoCompany.svg");
    footerContiner.append(footerText, footerSVG);
}