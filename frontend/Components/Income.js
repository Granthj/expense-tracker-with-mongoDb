import { API_URL } from "../src/config.js";

export function Income(navigate) {

    const container = document.createElement('div');
    container.innerHTML = `
        <div class="income-container">
            <h2>Income Page</h2>
            <form method="post" id="income-form">
                <div id="amountDiv">
                    <label for="amount">Amount:</label>
                    <input type="number" id="amount" placeholder="Enter your income amount" name="amount" required>
                </div>
                <div id="descriptionDiv">
                    <label for="description">Description:</label>
                    <input type="text" id="description" placeholder="Enter description" name="description" required>
                </div>
                <button type="submit" id="button">Add Income</button>
            </form>
            <div id="incomeList"></div>
        </div>
    
    `;
    const incomeList = container.querySelector('#incomeList');
    const form = container.querySelector('#income-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const amount = e.target.amount.value;
            const description = e.target.description.value;

            const token = localStorage.getItem("token");
            const response = await axios.post(`${API_URL}/add-income`, {
                amount,
                description
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            getIncome();
            if (response.status === 200) {
                incomeList.innerHTML = "";
            }
        }
        catch (err) {
            console.error(err);
        }
    });
    async function getIncome() {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/income`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        incomeList.innerHTML = "";
        renderTable(res.data);
    }
    const renderTable = (data) => {
        const table = document.createElement("table");
        table.border = "1";

        const header = ["Amount", "Description", "Month", "Year", "Action"];
        const tr = document.createElement("tr");

        header.forEach((h) => {
            const th = document.createElement("th");
            th.textContent = h;
            tr.appendChild(th);
        });

        table.appendChild(tr);

        data.data.forEach((item) => {
            const row = document.createElement("tr");

            row.innerHTML = `
        <td>${item.amount}</td>
        <td>${item.description}</td>
        <td>${item.month}</td>
        <td>${item.year}</td>
      `;

            const td = document.createElement("td");
            const btn = document.createElement("button");
            btn.textContent = "Delete";

              btn.addEventListener("click", async () => {
                const token = localStorage.getItem("token");

                await axios.delete(
                  `${API_URL}/delete-income/${item.id}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                row.remove();
              });

            td.appendChild(btn);
            row.appendChild(td);
            table.appendChild(row);
        });

        incomeList.appendChild(table);
    }
    getIncome();
    return container;
}