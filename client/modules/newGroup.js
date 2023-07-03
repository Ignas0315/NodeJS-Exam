const nameInput = document.getElementById('create-group');
const newGroupBtn = document.getElementById('create-group-btn');

newGroupBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const payload = {
        name: nameInput.value,
    };

    try {
        const response = await fetch('http://localhost:8080/groups', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        await response.json();

        if (response.ok) {
            alert(`New group named: ${nameInput.value} was created`);
        }

        return window.location.reload();
    } catch (error) {
        console.error(error);
    }
});
