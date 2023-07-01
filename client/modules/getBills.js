const queryString = window.location.search;
const group_params = queryString.split('=')[1];

const getBills = async () => {
    try {
        const res = await fetch(`http://localhost:8080/bills/${group_params}`, {
            headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const groupBills = await res.json();

        if (groupBills.length === 0) {
            return 0;
        }

        if (res.ok) {
            return groupBills;
        } else {
            alert('Something went wrong. Redirecting to login');
            return window.location.assign(`./login.html`);
        }
    } catch (error) {
        console.error(error);
    }
};

export { getBills };
