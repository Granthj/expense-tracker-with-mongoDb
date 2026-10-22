import { API_URL } from "../src/config.js";

export function Navbar(navigation) {

    const container = document.createElement('div');
    container.innerHTML = `
        <nav class="nav">
            <div class="nav-container">
                <div class="logo">ExpenseApp</div>

                <ul class="nav-links">
                    <li><a href="/payment">Go Payment</a></li>
                    <li><a href="/dashboard">Expenses</a></li>
                    <li><a href="/add-income">Add Income</a></li>
                    <li><a href="/add-note">Notes</a></li>
                    <li><a href="/report">Reports</a></li>
                    <li><a href="/premium-users">Premium Users</a></li>
                    <li><a href="/logout">Logout</a></li>
                </ul>

                <div class="menu-toggle">☰</div>
            </div>
        </nav>
    `
    const navLinks = container.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click',(e)=>{
            e.preventDefault();
            const route = link.getAttribute('href');
            if(route === '/logout'){
                localStorage.removeItem("token");
                navigation("/login");
            }
            else{
                navigation(route);
            }
        })
    });

    // mobile toggle
    const toggle = container.querySelector('.menu-toggle');
    const links = container.querySelector('.nav-links');

    toggle.addEventListener('click', () => {
        links.classList.toggle('active');
    });

return container;
}