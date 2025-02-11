export function generateRightPanelFund() {
    const html = $("<div>");
    const groupTextContainer = $("<div>").addClass("group-text-container flex flex-col items-center justify-center h-[95%]");
    const imageSVG = $("<img>").addClass("h-28 mb-4").attr("src", "../assets/svg/dove.svg");
    const doveContainer = $("<h2>").addClass("mb-2 font-bold").text("Dove");
    const textContainer = $("<h2>").addClass("font-bold").text("Conversa sin límites, conecta con el mundo.");
    groupTextContainer.append(imageSVG, doveContainer, textContainer);

    const footerContiner = $("<div>").addClass("footer back-bar h-4 mb-3 flex items-center justify-center bottom-0");
    const footerText = $("<p>").addClass("flex items-center justify-center h-full text-base mr-2 italic").text("Creado por la empresa TriCoded");
    const footerSVG = $("<img>").addClass("h-8").attr("src", "../assets/svg/logoCompany.svg");
    footerContiner.append(footerText, footerSVG);
    html.append(groupTextContainer, footerContiner);
    return html;
}

export function generateSearchBar() {
    const html = $("<div>");
    /* const headerContainer = $("<div>").addClass("w-full h-20 flex justify-between items-center py-2 px-4");

    const leftContainer = $("<div>").addClass("flex items-center");
    const icon1 = $("<img>").addClass("h-8 mr-2").attr("src", "../assets/svg/settings.svg");
    const icon2 = $("<img>").addClass("h-8").attr("src", "../assets/svg/add.svg");
    leftContainer.append(icon1, icon2);

    const rightContainer = $("<div>").addClass("flex items-center");
    const logo = $("<img>").addClass("h-16").attr("src", "../assets/svg/dove.svg");
    rightContainer.append(logo);

    headerContainer.append(leftContainer, rightContainer);
    fatherContainer.append(headerContainer); */

    const searchBar = $('<div>').addClass("container-search flex items-center py-2 rounded-md my-3 sm:block md:hidden");
    const searchWrapper = $('<div>').addClass("relative w-full flex items-center");
    const searchInput = $('<input>').addClass("input-search flex-grow h-10 w-full rounded-full pl-10 border focus:outline-none focus:ring-2 focus:ring-[#A9D6E5] focus:border-[#A9D6E5]").attr("type", "search").attr("placeholder", "Buscar contactos...");
    const searchIcon = $("<img>").addClass("h-5 absolute left-3").attr("src", "../assets/svg/search.svg");

    searchWrapper.append(searchInput, searchIcon);
    searchBar.append(searchWrapper);
    html.append(searchBar);
    return html;
}