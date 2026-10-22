import { API_URL } from "../src/config.js";

export function Login(navigate) {

    const container = document.createElement('div');
    container.innerHTML = `
        <div class="login-container">
        <form id="form">
        <h2 id="login-title">Login</h2>

                <div id="emailDiv">

                    <label for="email">Email:</label>
                    <input type="email" id="email" placeholder="Enter your email" name="email" required>
                </div>


                <div id="passwordDiv">

                    <label for="password">Password:</label>
                    <input type="password" id="password" placeholder="Enter your password" name="password" required>
                </div>

                <button type="submit" id="button">Login</button>
                <br>
                <a href="/sign-up" id="signup-link">Not registered yet? Click sign-up here</a>
                <br>
                <a href="/password" id="forgot-password-link">forgot-password?</a>
            </form>
        </div>
     `
    const errorExists = container.querySelector('#alert');
    const passwordDiv = container.querySelector('#passwordDiv');
    const inputPassword = container.querySelector('#password');
    const emailDiv = container.querySelector('#emailDiv');
    const inputEmail = container.querySelector('#email');
    const form = container.querySelector('#form');

    form.addEventListener('submit', async (e) => {



        try {

            e.preventDefault();

            const email = e.target.email.value;
            const password = e.target.password.value;

            const response = await axios.post(`${API_URL}/login`,
                {
                    email,
                    password
                }
            );
            if (!response.data.token) {
                throw new Error("No token received");
            }
            
            localStorage.setItem('token', response.data.token);
            alert('Log in successfully');
            navigate("/dashboard");
        }
        catch (err) {
            console.log(err.response)
            if (err.response && !err.response.data.success) {
                if (errorExists) {
                    errorExists.remove();
                }

                const p = document.createElement('p');
                p.id = 'alert';

                if (err.response.data.emailError && !err.response.data.passwordError) {
                    p.textContent = 'Email is not found';
                    inputEmail.insertAdjacentElement('afterend', p);
                    isFocus(inputEmail);
                }
                else {
                    p.textContent = 'Password is not matched';
                    inputPassword.insertAdjacentElement('afterend', p);
                    isFocus(inputPassword);
                }
            }
        }
    })
    const isFocus = (tagValue) => {

        tagValue.onfocus = () => {

            const alertError = container.getElementById('alert');
            if (alertError)
                alertError.remove();
        }

    }
    container.querySelector('#signup-link').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('/sign-up');

    });
    container.querySelector('#forgot-password-link').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('/password');
    });
    return container;
}