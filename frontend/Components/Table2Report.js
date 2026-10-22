import { API_URL } from "../src/config.js";

export function Table2Report(navigation) {

    const container = document.createElement('div');
    container.innerHTML = `
         <div>
            <p class="section-title">Yearly Report</p>
            <div class="table-card">
                <div class="scroll-wrap">
                    <table class="expense-table yearly-table">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th style="text-align:right">Income</th>
                                <th style="text-align:right">Expense</th>
                                <th style="text-align:right">Savings</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
    async function getData() {

        try{
            const response = await axios.get(`${API_URL}/premium/yearly-data-table`, {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(response.status === 200){
                const data = response.data;
                render(data.month, data.totalIncome, data.totalExpense, data.savings, data.title);
            }
        } catch (error) {
            console.error('Error fetching yearly data:', error);
        }
    }
    function render(month, totalIncome, totalExpense, savings, title){
        
        const tbody = container.querySelector('tbody');
        tbody.innerHTML = '';
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${month}</td>
            <td class="income" style="text-align:right">${totalIncome}</td>
            <td class="expense" style="text-align:right">${totalExpense}</td>
            <td class="savings" style="text-align:right">${savings}</td>
        `
        tbody.appendChild(tr);

        const totalRow = document.createElement('tr');
        totalRow.classList.add('yearly-total-row');

        totalRow.innerHTML = `
            <td style="font-weight:bold">Total</td>
            <td style="text-align:right">₹${totalIncome}</td>
            <td style="text-align:right">₹${totalExpense}</td>
            <td style="text-align:right">₹${savings}</td>
        `
        tbody.appendChild(totalRow);
        

    }
    getData();

    return container;
}