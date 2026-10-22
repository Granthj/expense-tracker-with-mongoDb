import { Table1Report } from "./Table1Report.js";
import { Table2Report } from "./Table2Report.js";
import { Table3Report } from "./Table3Report.js";
// import { API_URL } from "../src/config.js";

export function Report(navigation) {
    const mainContainer = document.createElement('div');
    mainContainer.innerHTML = `
        <header class="page-header">
            <h1>Day to Day Expenses</h1>
            <p class="timestamp"></p>
            <button id="downloadReport">Download Report</button>
        </header>

        <div class="container" id="reportContainer">

            <div class="year-badge"></div>

        </div>
    `;
    const container = mainContainer.querySelector('.container');
    container.appendChild(Table1Report());
    container.appendChild(Table2Report());
    container.appendChild(Table3Report());

    const timestamp = mainContainer.querySelector('.timestamp');
    const reportContainer = mainContainer.querySelector('#reportContainer');

    timestamp.appendChild(document.createTextNode(new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })));
    mainContainer.querySelector('#downloadReport').addEventListener('click',async()=>{

    const { jsPDF } = window.jspdf;
    const element = document.getElementById('reportContainer');

    // hide button for clean PDF
    const btn = mainContainer.querySelector('#downloadReport');
    btn.style.display = 'none';

    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');

    const now = new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    pdf.setFontSize(10);
    pdf.text(now, 200, 10, { align: 'right' });

    const imgWidth = 210;
    const pageHeight = 297;

    const imgHeight = canvas.height * imgWidth / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
        position = heightLeft - imgHeight+15;
        pdf.addPage();
        pdf.setFontSize(10);
        pdf.text(now, 200, 10, { align: 'right' });
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }

    pdf.save('Expense_Report.pdf');

    // show button again
    btn.style.display = 'block';
    })

    return mainContainer;
}