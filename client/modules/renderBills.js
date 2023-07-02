import { getBills } from './getBills.js';

const renderGroupBills = async () => {
    try {
        const groupBills = await getBills();

        const billsContainer = document.getElementById('bills');

        if (groupBills === 0) {
            const noBillsHeading = document.createElement('h1');
            noBillsHeading.setAttribute('id', 'no-available-bills');
            noBillsHeading.innerHTML =
                'You have no bills in this group. Please add some using form below.';
            billsContainer.appendChild(noBillsHeading);
        } else {
            billsContainer.innerHTML = '';

            const groupsBillHeading = document.createElement('h1');
            groupsBillHeading.setAttribute('id', 'groups-bill-heading');
            groupsBillHeading.innerHTML = `Group's bills:`;
            billsContainer.appendChild(groupsBillHeading);

            const tableEl = document.createElement('table');
            const tableBody = document.createElement('tbody');
            const tableHeadRow = document.createElement('tr');
            const tableHeadId = document.createElement('th');
            const tableHeadDescription = document.createElement('th');
            const tableHeadAmount = document.createElement('th');

            tableEl.setAttribute('id', 'table-main');
            tableBody.setAttribute('id', 'table-body');
            tableHeadRow.setAttribute('id', 'table-head-row');

            tableHeadId.innerHTML = 'Group ID';
            tableHeadAmount.innerHTML = 'Amount';
            tableHeadDescription.innerHTML = 'Description';

            tableHeadRow.appendChild(tableHeadId);
            tableHeadRow.appendChild(tableHeadAmount);
            tableHeadRow.appendChild(tableHeadDescription);

            tableBody.appendChild(tableHeadRow);
            tableEl.appendChild(tableBody);

            groupBills.forEach((bill, index) => {
                const newRow = document.createElement('tr');
                const idDataCell = document.createElement('td');
                const amountDataCell = document.createElement('td');
                const descriptionDataCell = document.createElement('td');

                idDataCell.innerHTML = bill.id;
                amountDataCell.innerHTML = bill.amount;
                descriptionDataCell.innerHTML = bill.description;

                newRow.appendChild(idDataCell);
                newRow.appendChild(amountDataCell);
                newRow.appendChild(descriptionDataCell);

                tableBody.appendChild(newRow);
            });

            billsContainer.appendChild(tableEl);
        }
    } catch (error) {
        console.error(error);
    }
};

export { renderGroupBills };
