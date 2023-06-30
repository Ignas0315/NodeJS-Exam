const queryString = window.location.search;
const params = queryString.split('=')[1];

const getBills = async () => {
    try {
        const res = await fetch(``);
    } catch (error) {
        console.error(error);
    }
};

// const getUserGroups = async () => {
//     try {
//         const res = await fetch('http://localhost:8080/accounts', {
//             headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
//         });

//         const userGroups = await res.json();

//         console.log(userGroups);

//         if (userGroups.length === 0) {
//             return 0;
//         }

//         if (!res.ok) {
//             return window.location.assign('./login.html');
//         }

//         return userGroups;
//     } catch (error) {
//         console.error(error);
//     }
// };

// export { getAllGroups, getUserGroups };
