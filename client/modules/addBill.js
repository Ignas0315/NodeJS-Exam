const queryString = window.location.search;
const group_params = queryString.split('=')[1];
const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');
const addBillBtn = document.getElementById('submit-bill');

addBillBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const payload = {
        amount: amountInput.value,
        password: descriptionInput.value,
    };

    try {
        const response = await fetch('http://localhost:8080/bills', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        await response.json();

        if (response.ok) {
            alert('Bill was added successfully');
        }

        return window.location.reload();
    } catch (error) {
        console.error(error);
    }
});

export { addBill };

// try {
//     const response = await fetch('http://localhost:8080/login', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });

//     const userRes = await response.json();

//     if (response.ok) {
//         localStorage.setItem('token', userRes.token);

//         return window.location.assign('./groups.html');
//     }

//     if (!response.ok) {
//         return alert(response.status.Text);
//     }
// } catch (error) {
//     console.log(error);
// }
