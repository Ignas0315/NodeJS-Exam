import { getAllGroups } from './getGroups.js';
import { getUserGroups } from './getGroups.js';

const renderUserGroups = async () => {
    const userGroups = await getUserGroups();

    console.log(userGroups);
};

export { renderUserGroups };
