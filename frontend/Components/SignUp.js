import { API_URL } from "../src/config.js";

export function SignUp(navigate) {

    const container = document.createElement('div');
    container.innerHTML = `
    <div class="signup-container">
         <form id="form">
         <h2>Sign Up</h2>
            <div id="nameDiv">

                <label for="name">Name:</label>
                <input type="text" id="name" placeholder="Enter your name" name="name" required>
            </div>

            <div id="emailDiv">

                <label for="email">Email:</label>
                <input type="email" id="email" placeholder="Enter your email" name="email" required>
            </div>

            <div id="passwordDiv">

                <label for="password">Password:</label>
                <input type="password" id="password" placeholder="Enter your password" name="password" required>
            </div>

            <button type="submit" id="button">Sign Up</button>
            <br>
            <a href="/login" id="login-link">Already registered? Click login here</a>
        </form>
        </div>
    `
    const errorExists = container.querySelector('#alert');
    const inputEmail = container.querySelector('#email');
    const form = container.querySelector('#form');
    form.addEventListener('submit', async (e) => {

        try {

            e.preventDefault();

            const name = e.target.name.value;
            const email = e.target.email.value;
            const password = e.target.password.value;

            const response = await axios.post(`${API_URL}/sign-up`, {
                name,
                email,
                password
            });
            console.log(response);
            navigate('/login');
        }
        catch (err) {
            if (err.response) {
                if (errorExists) {
                    errorExists.remove();
                }
                const p = document.createElement('p');

                p.textContent = err.response.data.message;
                p.id = 'alert';
                inputEmail.insertAdjacentElement('afterend', p);


                inputEmail.addEventListener('focus', () => {
                    const alertError = container.querySelector('#alert');
                    if (alertError)
                        alertError.remove();
                })
            }
            else {
                console.log(err);
            }
        }
    });
    container.querySelector('#login-link').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('/login');
    });
    return container;
}