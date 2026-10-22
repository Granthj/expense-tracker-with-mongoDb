import { API_URL } from "../src/config.js";

export function Note(navigation) {
    
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="note-container">
            <h2>Notes Page</h2>
            <form method="post" id="note-form">
                <div id="descriptionDiv">
                    <label for="description">Description:</label>
                    <input type="text" id="description" placeholder="Enter description" name="description" required>
                </div>
                <button type="submit" id="button">Add Note</button>
            </form>
            <div id="noteList"></div>
        </div>
    `;

    const form = container.querySelector('#note-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const description = e.target.description.value;
        try{
            const response = await axios.post(`${API_URL}/add-note`,
                {
                     description   
                },
                {
                    headers:{'Authorization': `Bearer ${localStorage.getItem('token')}`}
                }
            );
            getData();
            form.reset();
        }
        catch(err){
            console.log('Error adding note:', err);
        }
});
    async function getData(){

        try{
            const response = await axios.get(`${API_URL}/get-notes`,
                {
                    headers:{'Authorization': `Bearer ${localStorage.getItem('token')}`}
                }
            );
            if(response.status === 200){
                const notes = response.data.notes;
                render(notes);
            }
        }
        catch(err){
            console.log('Error fetching notes:', err);
        }
    }
    function render(notes){
        const noteList = container.querySelector('#noteList');
        noteList.innerHTML = '';
        const table = document.createElement('table');
        table.border = "1";
        const header = ['Date','Description','Actions'];
        const tr = document.createElement('tr');
        header.forEach(h=>{
            const th = document.createElement('th');
            th.innerText = h;
            tr.appendChild(th);
        });
        table.appendChild(tr);
        notes.forEach(note=>{
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${note.date}</td>
                <td>${note.description}</td>
            `
            const td = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.addEventListener('click', async ()=>{

                await axios.delete(
                  `${API_URL}/delete-note/${note.id}`,
                  {
                    headers:{'Authorization': `Bearer ${localStorage.getItem('token')}`}
                  }
                );

                row.remove();
              });
              td.appendChild(deleteButton);
              row.appendChild(td);
              table.appendChild(row);
            });
            noteList.appendChild(table);

    }
    getData();
    return container;
}