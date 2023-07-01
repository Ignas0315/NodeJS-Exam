import { renderUserGroups } from './renderGroups.js';

await renderUserGroups();

const addUserToGroupBtn = document.getElementById('submit-user-to-group');

addUserToGroupBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const groupIdInput = document.getElementById('add-group').value;

    try {
        const res = await fetch('http://localhost:8080/accounts', {
            method: 'POST',
            body: JSON.stringify({ group_id: groupIdInput }),
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const groupAdd = await res.json();

        if (res.ok) {
            if (groupAdd.message.includes('User added to the group'))
                alert(`You were added to group ${groupIdInput}`);
        }
        if (!res.ok) {
            alert('Could not add to new group');
        }
    } catch (error) {
        console.error(error);
    }
});
