export function generateSettings(user) {
    const settingsContainer = $(".scrollbar-custom");

    const settingsBar = $('<div>').addClass('settings-bar h-14 flex items-center');
    const backButton = $('<button>').addClass('p-2 bg-[#468FAF] rounded-full h-12 w-12 flex items-center justify-center');
    const backLink = $('<a>');
    const backImg = $('<img>').addClass('h-5').attr('src', '../assets/svg/arrow.svg');
    backLink.append(backImg);
    backButton.append(backLink);
    const settingsTitle = $('<h3>').addClass('text-xl ml-4').text('Ajustes');
    settingsBar.append(backButton, settingsTitle);
    const profileContainer = $('<div>').addClass('profile-container h-24 flex items-center my-5');
    const contenedorUser = $('<div>').addClass('flex flex-col ml-6');
    const profileImg = $('<img>').addClass('h-16 rounded-full').attr('src', user.image);
    const profileName = $('<h2>').addClass('text-xl font-bold ').text(user.username);
    const profileBio = $("<p>").addClass("text-sm w-56 sm:w-62 md:w-62 truncate").text(user.bio);
    contenedorUser.append(profileName, profileBio);
    profileContainer.append(profileImg, contenedorUser);

    const separator = $('<hr>').addClass('border-t-2 border-[#468FAF] mx-9 mb-6');
    const listSettings = $('<div>').addClass('list-settings flex h-auto');
    const settingsList = $('<ul>').addClass('flex flex-col h-full space-y-6');

    const settingsItems = [
        { imgSrc: '../assets/svg/profile.svg', text: 'Cuenta' },
        { imgSrc: '../assets/svg/padlock.svg', text: 'Privacidad' },
        { imgSrc: '../assets/svg/notifications.svg', text: 'Notificaciones' },
        { imgSrc: '../assets/svg/help.svg', text: 'Ayuda' },
        { imgSrc: '../assets/svg/logout.svg', text: 'Cerrar sesión', imgClass: 'h-9 ml-1' }
    ];

    settingsItems.forEach(item => {
        const button = $('<button>');
        const listItem = $('<li>').addClass('flex items-center');
        const img = $('<img>').addClass(item.imgClass || 'h-10').attr('src', item.imgSrc);
        const text = $('<h2>').addClass('ml-4 text-xl').text(item.text);
        listItem.append(img, text);
        button.append(listItem);
        settingsList.append(button);
    });

    listSettings.append(settingsList);
    settingsContainer.append(settingsBar, profileContainer, separator, listSettings);
}