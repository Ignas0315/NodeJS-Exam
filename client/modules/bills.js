import { renderGroupBills } from './renderBills.js';

const queryString = window.location.search;
const group_params = queryString.split('=')[1];
const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');
const addBillBtn = document.getElementById('submit-bill');

await renderGroupBills();

addBillBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const payload = {
        group_id: group_params,
        amount: amountInput.value,
        description: descriptionInput.value,
    };

    console.log(payload);

    try {
        const response = await fetch('http://localhost:8080/bills', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`,
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
