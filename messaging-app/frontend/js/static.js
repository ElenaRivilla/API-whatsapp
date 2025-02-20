export function generateRightPanelFund() {
    const html = $("<div>");
    const groupTextContainer = $("<div>").addClass("group-text-container flex flex-col items-center justify-center h-[95%]");
    const imageSVG = $("<img>").addClass("h-28 mb-4").attr({ "src": "../assets/svg/dove.svg" }).attr("alt", "logo dove");;
    const doveContainer = $("<h2>").addClass("mb-2 font-bold").text("Dove");
    const textContainer = $("<h2>").addClass("font-bold").text("Conversa sin límites, conecta con el mundo.");

    groupTextContainer.append(imageSVG, doveContainer, textContainer);

    const footerContiner = $("<div>").addClass("footer back-bar h-4 mb-3 flex items-center justify-center bottom-0");
    const footerText = $("<p>").addClass("flex items-center justify-center h-full text-base mr-2 italic").text("Creado por la empresa TriCoded");
    const footerSVG = $("<img>").addClass("h-8").attr("src", "../assets/svg/logoCompany.svg").attr("alt", "logo company");

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
    const searchInput = $('<input>').addClass(`input-search flex-grow h-10 w-full rounded-full pl-10 border focus:outline-none focus:ring-2 focus:ring-[${accentColor}] focus:border-[${accentColor}]`).attr({
        "type": "search",
        "placeholder": "Buscar contactos...",
        "aria-label": "Buscar contactos"
    });
    const searchIcon = $("<img>").addClass("h-5 absolute left-3").attr({
        "src": "../assets/svg/search.svg",
        "alt": "search button",
        "aria-hidden": "true"
    });

    searchWrapper.append(searchInput, searchIcon);
    searchBar.append(searchWrapper);
    html.append(searchBar);
    return html;
}

const rootStyles = getComputedStyle(document.documentElement);
export let backgroundColor = rootStyles.getPropertyValue('--background-color').trim();
export let accentColor = rootStyles.getPropertyValue('--accent-color').trim();
export let containerColor = rootStyles.getPropertyValue('--container-color').trim();
export let textColor = rootStyles.getPropertyValue('--text-color').trim();
export let textHolderColor = rootStyles.getPropertyValue('--text-holder-color').trim();
export let receivedMsg = rootStyles.getPropertyValue('--received-msg-color').trim();
export let textBar = rootStyles.getPropertyValue('--typebar-color').trim();
export let sendButton = rootStyles.getPropertyValue('--send-button-color').trim();

export function setDarkMode() {
    document.documentElement.style.setProperty('--background-color', '#012A4A');
    document.documentElement.style.setProperty('--accent-color', '#89C2D9');
    document.documentElement.style.setProperty('--container-color', '#01497C');
    document.documentElement.style.setProperty('--text-color', '#ffffff');
    document.documentElement.style.setProperty('--received-msg-color', '#012A4A');
    document.documentElement.style.setProperty('--sent-msg-color', '#2A6F97');
    document.documentElement.style.setProperty('--typebar-color', '#012A4A');
    document.documentElement.style.setProperty('--send-button-color', '#2A6F97');
    backgroundColor = rootStyles.getPropertyValue('--background-color').trim();
    accentColor = rootStyles.getPropertyValue('--accent-color').trim();
    containerColor = rootStyles.getPropertyValue('--container-color').trim();
    textColor = rootStyles.getPropertyValue('--text-color').trim();
    textHolderColor = rootStyles.getPropertyValue('--text-holder-color').trim();
    receivedMsg = rootStyles.getPropertyValue('--received-msg-color').trim();
    textBar = rootStyles.getPropertyValue('--typebar-color').trim();
    sendButton = rootStyles.getPropertyValue('--send-button-color').trim();
}

export function setLightMode() {
    document.documentElement.style.setProperty('--background-color', '#468FAF');
    document.documentElement.style.setProperty('--accent-color', '#A9D6E5');
    document.documentElement.style.setProperty('--container-color', '#f3f4f6');
    document.documentElement.style.setProperty('--text-color', '#000000');
    document.documentElement.style.setProperty('--received-msg-color', '#e5e7eb');
    document.documentElement.style.setProperty('--sent-msg-color', '#A9D6E5');
    document.documentElement.style.setProperty('--typebar-color', '#ffffff');
    document.documentElement.style.setProperty('--send-button-color', '#2C7DA0');
    backgroundColor = rootStyles.getPropertyValue('--background-color').trim();
    accentColor = rootStyles.getPropertyValue('--accent-color').trim();
    containerColor = rootStyles.getPropertyValue('--container-color').trim();
    textColor = rootStyles.getPropertyValue('--text-color').trim();
    textHolderColor = rootStyles.getPropertyValue('--text-holder-color').trim();
    receivedMsg = rootStyles.getPropertyValue('--received-msg-color').trim();
    textBar = rootStyles.getPropertyValue('--typebar-color').trim();
    sendButton = rootStyles.getPropertyValue('--send-button-color').trim();
}

export function errorMessage() {
    const containerError = $('<div>').css({
        display: 'flex',
        position: 'fixed',
        justifyContent: 'space-between',
        backgroundColor: '#f3f4f6e1',
        zIndex: 999,
        top: '-6rem', // Start above the viewport
        left: 0,
        width: '100%',
        height: '6rem',
        paddingLeft: '5%',
        paddingRight: '5%',
        transition: 'top 0.5s' // Add transition for smooth sliding
    });
    const textError = $('<p>').addClass('errorText text-red-500 flex flex-col justify-center items-center font-bold ');
    const buttonError = $('<button>').addClass('ml-2').append($('<img>').attr('src', '../assets/svg/close.svg').css({ width: '2rem', marginLeft: '2rem' })
    );

    containerError.append(textError, buttonError);
    $('body').prepend(containerError); // Add the error message container to the top of the body

    // Slide down effect
    setTimeout(() => {
        containerError.css('top', '0');
    }, 100);

    buttonError.on('click', () => {
        // Slide up effect before removing
        containerError.css('top', '-6rem');
        setTimeout(() => containerError.remove(), 500); // Wait for the slide up transition to complete
    });
}