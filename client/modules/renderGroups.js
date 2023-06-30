import { getUserGroups } from './getGroups.js';

const renderUserGroups = async () => {
    try {
        const userGroups = await getUserGroups();

        const groupsContainer = document.getElementById('groups-container');

        console.log(userGroups);

        if (userGroups === 0) {
            const noGroupsHeading = document.createElement('h1');
            noGroupsHeading.setAttribute('id', 'no-available-groups');
            noGroupsHeading.innerHTML =
                'You have no groups assigned. Please add some using form below.';
            groupsContainer.appendChild(noGroupsHeading);
        } else {
            groupsContainer.innerHTML = '';
            userGroups.forEach((group) => {
                const groupId = group.id;
                const groupName = group.name;

                const groupCard = document.createElement('div');
                const groupCardId = document.createElement('h2');
                const groupCardName = document.createElement('p');
                groupCard.setAttribute('class', 'group-card');
                groupCardId.setAttribute('class', 'group-id');
                groupCardName.setAttribute('class', 'group-name');

                groupCard.addEventListener('click', () => {
                    window.location.assign(`./bills.html?group_id=${groupId}`);
                });

                groupCardId.innerHTML = groupId;
                groupCardName.innerHTML = groupName;

                groupsContainer.appendChild(groupCard);
                groupCard.appendChild(groupCardId);
                groupCard.appendChild(groupCardName);
            });
        }
    } catch (error) {
        console.error(error);
    }
};

export { renderUserGroups };
