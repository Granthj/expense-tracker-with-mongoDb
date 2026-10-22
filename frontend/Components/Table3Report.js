import { API_URL } from "../src/config.js";

export function Table3Report(navigation) {

    const container = document.createElement('div');
    container.innerHTML = `
         <div>
            <p class="section-title"></p>
            <div class="table-card">
                <div class="scroll-wrap">
                    <table class="expense-table notes-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;


    
    async function getData(){
        
        try{
            const response = await axios.get(`${API_URL}/premium/notes-data-table`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(response.status === 200){
                const data = response.data;
                render(data.notes);
            }
        }
        catch(err){
            console.log(err);
        }
    }
    function render(notes){
        const now = new Date();
        const currentYear = now.getFullYear();
        const paragraph = container.querySelector('.section-title');
        paragraph.appendChild(document.createTextNode(`Notes Report ${currentYear}`));
        const tableBody = container.querySelector('tbody');
        notes.forEach(note => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${note.date}</td>
                <td>${note.description}</td>`
                tableBody.appendChild(row);
        });
        
    }

    getData();
    return container;
}