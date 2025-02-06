document.addEventListener('DOMContentLoaded', cargaDOM);

function cargaDOM() {
    generateSettings();
}

function generateSettings() {
    const settingsContainer = $(".scrollbar-custom");

    const settingsBar = $('<div>', { class: 'settings-bar h-14 flex items-center' });
    const backButton = $('<button>', { class: 'p-2 bg-[#468FAF] rounded-full h-12 w-12 flex items-center justify-center' });
    const backLink = $('<a>', { href: './chatsList.html' });
    const backImg = $('<img>', { class: 'h-5', src: '../assets/svg/arrow.svg' });
    backLink.append(backImg);
    backButton.append(backLink);
    const settingsTitle = $('<h3>', { class: 'text-xl ml-4', text: 'Settings' });
    settingsBar.append(backButton, settingsTitle);

    const profileContainer = $('<div>', { class: 'profile-container h-24 flex items-center my-6' });
    const profileImg = $('<img>', { class: 'h-24 rounded-full', src: 'https://picsum.photos/300/300?random=7' });
    const profileName = $('<h2>', { class: 'text-2xl font-bold ml-6', text: 'Alice Johnson' });
    profileContainer.append(profileImg, profileName);

    const separator = $('<hr>', { class: 'border-t-2 border-[#468FAF] mx-9 mb-6' });

    const listSettings = $('<div>', { class: 'list-settings flex h-auto' });
    const settingsList = $('<ul>', { class: 'flex flex-col h-full space-y-6' });

    const settingsItems = [
        { imgSrc: '../assets/svg/profile.svg', text: 'Cuenta' },
        { imgSrc: '../assets/svg/padlock.svg', text: 'Privacidad' },
        { imgSrc: '../assets/svg/notifications.svg', text: 'Notificaciones' },
        { imgSrc: '../assets/svg/help.svg', text: 'Ayuda' },
        { imgSrc: '../assets/svg/logout.svg', text: 'Cerrar sesión', imgClass: 'h-9 ml-1' }
    ];

    settingsItems.forEach(item => {
        const button = $('<button>');
        const listItem = $('<li>', { class: 'flex items-center' });
        const img = $('<img>', { class: item.imgClass || 'h-10', src: item.imgSrc });
        const text = $('<h2>', { class: 'ml-4 text-xl', text: item.text });
        listItem.append(img, text);
        button.append(listItem);
        settingsList.append(button);
    });

    listSettings.append(settingsList);
    settingsContainer.append(settingsBar, profileContainer, separator, listSettings);
}