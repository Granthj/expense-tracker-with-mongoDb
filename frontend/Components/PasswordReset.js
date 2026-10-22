import { API_URL } from "../src/config.js";

export function PasswordReset(navigate) {
    console.log("PasswordReset mounted");
    const container = document.createElement('div');
    
        container.innerHTML = `
            <div class="main-container">
            <form method="post" id="form">

                <div id="passwordDiv">

                    <label for="password">Password:</label>
                    <input type="password" id="password" class="password" placeholder="Enter your password" name="password" required>
                </div>
                <div id="confirmPasswordDiv">

                    <label for="newpassword">Confirm Password:</label>
                    <input type="password" class="password" id="newPassword" placeholder="Enter your password again" name="newPassword" required>
                </div>
                <br>
                <div id="passwordError" class="error-message"></div>
                <button type="submit" id="button">Change</button>
                <br>
                <div id="message"></div>
            </form>
            <br>
        </div>
        `
        const form = container.querySelector('#form');
        const errorDiv = container.querySelector('#passwordError');
        const input = container.querySelector('#newPassword');
        const div = container.querySelector('#message');
        form.addEventListener('submit',async (e) => {

            try {
                e.preventDefault();
                const password = e.target.password.value;
                const newPassword = e.target.newPassword.value;
                if (password !== newPassword) {

                    errorDiv.textContent = 'Password does not match confirm password';
                    errorDiv.classList.add('show');
                    input.insertAdjacentElement("afterend", errorDiv);
                    return;
                }
                else {
                    errorDiv.classList.remove('show');
                    errorDiv.innerHTML = ''
                }
                const id = new URLSearchParams(window.location.search).get('id');
                const res = await axios.post(`${API_URL}/password/forgotpassword`, {
                    id,
                    password,
                    newPassword
                });
                e.target.password.value = '';
                e.target.newPassword.value = '';
                console.log(res);
                if (res.data) {
                    const h1 = document.createElement('h1');

                    h1.textContent = 'Congratulation your password is changed try to login again'
                    div.appendChild(h1);
                    setTimeout(() => {
                        div.innerHTML = '';
                        window.location.replace('/login');
                    }, 2000);
                }
            }
            catch (err) {
                console.log(err.response.data.message);
            }
        
    });
    return container;
}
