import { API_URL } from "../src/config.js";

export function Table1Report(navigation) {

    const container = document.createElement('div');
    container.innerHTML = `
        <div>
            <p class="section-title"></p>
            <div class="table-card">
                <div class="scroll-wrap">
                    <table class="expense-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Income</th>
                                <th>Expense</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    async function getData() {
        console.log('table1 report',localStorage.getItem('token'))
        try {
            const response = await axios.get(`${API_URL}/premium/monthly-data-table`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                const data = response.data;
                render(data.data, data.totalExpense, data.totalIncome, data.savings, data.monthAndDate);
            }
        }
        catch (err) {
            console.error('Error fetching data:', err);
        }
    }
    function render(groupedData, totalExpense, totalIncome, savings, monthAndDate) {
        const tbody = container.querySelector('tbody');
        tbody.innerHTML = '';
        let dailyIncome = 0;
        let dailyExpense = 0;
        const values = Object.entries(groupedData);

        values.forEach(([date, item]) => {
            item.forEach(i => {

                const tr = document.createElement('tr');
                if (i.type === 'Income') {
                    dailyIncome += Number(i.amount);
                }
                else {
                    dailyExpense += Number(i.amount);
                }
                tr.innerHTML = `
                    <td>${new Date(date).toLocaleDateString('en-IN',{
                        day:'2-digit',
                        month:'short',
                        year:'numeric'
                    })}</td>
                    <td>${i.description}</td>
                    <td>${i.category || '-'}</td>
                    <td>${i.type === 'Income' ? i.amount : '-'}</td>
                    <td>${i.type === 'Expense' ? i.amount : '-'}</td>
                `;
                tbody.appendChild(tr);
            });
            const subTotalRow = document.createElement('tr');
            subTotalRow.classList.add('subtotal-row');
            subTotalRow.innerHTML = `
                <td colspan="3"><strong>Daily Total (${date})</strong></td>
                <td class="income"><strong>${dailyIncome}</strong></td>
                <td class="expense"><strong>${dailyExpense}</strong></td>
            `
        });
        const totalRow = document.createElement('tr');
        totalRow.classList.add('grand-total-row');

        totalRow.innerHTML = `
            <td colspan="3">Total</td>
            <td class="income">${totalIncome}</td>
            <td class="expense">${totalExpense}</td>
        `;
        tbody.appendChild(totalRow);

        const savingsRow = document.createElement('tr');
        savingsRow.innerHTML = `
            <td colspan="5" class="savings-row">Savings: ${savings}</td>
        `;
        tbody.appendChild(savingsRow);
        const sectionTitle = container.querySelector('.section-title');
        sectionTitle.textContent = `${monthAndDate}`;
    }
    getData();
    return container;
}
