import { API_URL } from "../src/config.js";

export function PremiumUser(navigate){

    const container = document.createElement('div');

    container.innerHTML = `
        <div class="premium-container">
            <h1>Premium Users</h1>
            <div id="premiumDiv"></div>
        </div>
        `;
    const premiumDiv = container.querySelector('#premiumDiv');

    async function getPremiumUser(){

        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/premium`, {
        headers: { Authorization: `Bearer ${token}` },
        });

        premiumDiv.innerHTML = '';
        renderTable(res.data);
    }
    function renderTable(data){
        
        const table = document.createElement("table");
        table.border = "1";

        const header = ["Name","Amount"];
        const tr = document.createElement("tr");

        header.forEach((h) => {
            const th = document.createElement("th");
            th.textContent = h;
            tr.appendChild(th);
        });

        table.appendChild(tr);

        data.forEach((user) => {
            const row = document.createElement("tr");
            if(user.totalExpense !== 0){

    
                row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.totalExpense}</td>
            `;
            }
        table.appendChild(row);
    });

    premiumDiv.appendChild(table);
}
    getPremiumUser();
    return container;
}