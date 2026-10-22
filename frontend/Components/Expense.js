import { API_URL } from "../src/config.js";

export function Expense(navigate) {
  const container = document.createElement("div");

  container.innerHTML = `
    <div class="expense-container">
    <h1>Add your expense</h1>
    <form id="expenseForm">
        <div>
          <label>Amount:</label>
          <input type="text" id="expenseAmount" name="expenseAmount">
        </div>

        <div>
          <label>Description:</label>
          <input type="text" id="description" name="description">
        </div>

        <div>
          <label>Note:</label>
          <input type="text" id="note" name="note">
        </div>

        <div id="categoryDiv">
          <label>Choose category:</label>
          <select id="category" name="category">
            <option value="movie">Movies</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="gaged">Gageds</option>
            <option value="cloth">Cloths</option>
            <option value="shoe">Shoes</option>
            <option value="gimick">Gimicks</option>
          </select>
        </div>

        <button type="submit">Add Expense</button>

        <div id="categoryBtnAiDiv">
          <button id="categoryBtnAi" type="button">
            Choose category by AI
          </button>
        </div>
      </form>
    </div>

    <div id="expenseSection">

      <div id="pageControls">
        <label><h2>Items per page:</h2></label>
        <select id="pageSize">
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="8">8</option>
        </select>
      </div>

      <h2 id="title-expense-table">Your expenses</h2>
      <div id="expenseList"></div>

      <div id="pagination"></div>

    </div>
    <div id="dynamicButton"></div>
  `;

  let limit = parseInt(localStorage.getItem('limit')||2);
  let currentPage = parseInt(localStorage.getItem('currentPage')||1);
  container.querySelector('#pageSize').value = limit;

  const form = container.querySelector("#expenseForm");
  const amountTag = container.querySelector("#expenseAmount");
  const descriptionTag = container.querySelector("#description");
  const noteTag = container.querySelector("#note");
  const categoryDiv = container.querySelector("#categoryDiv");
  const categoryBtn = container.querySelector("#categoryBtnAi");
  const categoryBtnDiv = container.querySelector("#categoryBtnAiDiv");
  const selectedCategory = container.querySelector("#category");
  const expenseList = container.querySelector("#expenseList");
  const premiumUl = container.querySelector("#premium");

  function removeWarn() {
    const warn = container.querySelector("#warn-msg");
    if (warn) warn.remove();
  }

  amountTag.addEventListener("input", removeWarn);
  descriptionTag.addEventListener("input", removeWarn);

  async function loadCategory(description) {
    const old = container.querySelector("#ai-category");
    if (old) old.remove();

    const select = document.createElement("select");
    select.id = "ai-category";

    const res = await axios.post(`${API_URL}/create-category`, {
      description,
    });

    const categories = JSON.parse(res.data.response);

    //updated part
    const placeholder = document.createElement("option");
    placeholder.textContent = "Select category";
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    categories.forEach((item) => {
      const clean = item.replace(/\*\*/g, "");
      const option = document.createElement("option");
      option.value = clean;
      option.textContent = clean;
      select.appendChild(option);
    });

    categoryDiv.appendChild(select);
    return select;
  }

  categoryBtn.addEventListener("click", async () => {
    let warn = container.querySelector("#warn-msg");

    if (!warn) {
      warn = document.createElement("p");
      warn.id = "warn-msg";
      warn.style.color = "red";
    }

    const description = descriptionTag.value;

    if (!description) {
      warn.textContent = "Please fill description first";
      categoryBtnDiv.appendChild(warn);
      return;
    }

    selectedCategory.disabled = true;

    const aiSelect = await loadCategory(description);

    aiSelect.addEventListener("change", () => {
      const value = aiSelect.value;

      let exists = false;
      for (let option of selectedCategory.options) {
        if (option.value === value){
          exists = true;
          break;
        } 
      }

      if (!exists) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        selectedCategory.appendChild(option);
      }

      selectedCategory.value = aiSelect.value;
      aiSelect.remove();
      selectedCategory.disabled = false;
    });
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const expenseAmount = amountTag.value;
    const description = descriptionTag.value;
    const note = noteTag.value;
    const category = selectedCategory.value;

    const token = localStorage.getItem("token");
    console.log(note,'gh')
    await axios.post(`${API_URL}/expense`,
      { expenseAmount, description, category, note },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    form.reset();
    getExpenses(currentPage);
  });
  container.querySelector('#pageSize').addEventListener('change',(e)=>{
    limit = parseInt(e.target.value);
    let currentPage = localStorage.getItem('currentPage');
    localStorage.setItem("limit",limit);
    getExpenses(currentPage);
  });
  
  async function getExpenses(page = 1) {
    const token = localStorage.getItem("token");
    const limit = localStorage.getItem('limit');

    const res = await axios.get(`${API_URL}/expense?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expenseList.innerHTML = "";
    
    if(res.data.totalPages > 0 && page > res.data.totalPages){
      currentPage = res.data.totalPages;
      localStorage.setItem("currentPage",currentPage);
      return getExpenses(currentPage)
    }
    renderTable(res.data.expenses,res.data.currentPage);
  
    renderPagination(res.data.totalPages,res.data.currentPage,res.data.expenses);
  }

  function renderPagination(totalPage,currentPage,expenses){

    const dynamicButtonDiv = container.querySelector('#dynamicButton');
    dynamicButtonDiv.innerHTML = "";
    
    if(totalPage === 0) return;

    for(let i = 1;i <= totalPage;i++){
      const currentPageButton = document.createElement('button');
      currentPageButton.classList.add('pagination-btn');
      currentPageButton.classList.add('active');
      currentPageButton.textContent = i;

      
      if(currentPage === i){
        currentPageButton.disabled = true;
        currentPageButton.style.fontWeight = 'bold';
      }
      currentPageButton.addEventListener('click',()=>{
        currentPage = i;
        localStorage.setItem("currentPage",currentPage)
        getExpenses(i);
      });
      dynamicButtonDiv.appendChild(currentPageButton);
    }

  }
  function renderTable(data,currentPage) {
    const table = document.createElement("table");
    table.border = "1";

    const header = ["Amount", "Description", "Category", "Note", "Action"];
    const tr = document.createElement("tr");

    header.forEach((h) => {
      const th = document.createElement("th");
      th.textContent = h;
      tr.appendChild(th);
    });

    table.appendChild(tr);

    data.forEach((item) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.expenseAmount}</td>
        <td>${item.description}</td>
        <td>${item.category}</td>
        <td>${item.note}</td>
      `;

      const td = document.createElement("td");
      const btn = document.createElement("button");
      btn.textContent = "Delete";

      btn.addEventListener("click", async () => {
        const token = localStorage.getItem("token");

        await axios.delete(
          `${API_URL}/delete-expense/${item.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        row.remove();
        getExpenses(currentPage);
      });

      td.appendChild(btn);
      row.appendChild(td);
      table.appendChild(row);
    });

    expenseList.appendChild(table);
  }


  getExpenses(currentPage);

  return container;
}