const userToGroup = async () => {
    const groupIdInput = document.getElementById('add-group');

    try {
        const res = await fetch('http://localhost:8080/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`,
                body: JSON.stringify({ group_id: groupIdInput.value }),
            },
        });
        console.log(res);
        if (res.ok) {
            alert(`You were added to group ${groupIdInput.value}`);
        }
    } catch (error) {
        console.error(error);
    }
};

export { userToGroup };
