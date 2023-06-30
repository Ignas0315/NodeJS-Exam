const getAllGroups = async () => {
    try {
        const res = await fetch('http://localhost:8080/groups', {
            headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const allGroups = await res.json();

        if (!response.ok) {
            return window.location.assign('./login.html');
        }

        return allGroups;
    } catch (error) {
        console.error(error);
    }
};

const getUserGroups = async () => {
    try {
        const res = await fetch('http://localhost:8080/accounts', {
            headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const userGroups = await res.json();

        return userGroups;
    } catch (error) {
        console.error(error);
    }
};

export { getAllGroups, getUserGroups };
