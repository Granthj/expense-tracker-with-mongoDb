import { API_URL } from "../src/config.js";

export function ForgotPasswordLink(navigate) {

    const container = document.createElement('div');
    container.innerHTML = `
        <div class="forgot-password-container">
        <form id="form">
            <input type="email" name="email" required placeholder="Enter your email"/>
            <button type="submit">Send Reset Link</button>
            <div class="info"></div>
        </form>
        </div>
    `
    const form = container.querySelector('#form');
    const div = container.querySelector(".info")
    const h3 = document.createElement('h3');
    h3.classList.add('info-title');
    form.addEventListener('submit', async (e) => {
        
        try {
            e.preventDefault();
            const email = e.target.email.value;
            
            const verifyRes = await axios.post(
                `${API_URL}/password`,
                { email }
            );
            if(verifyRes.data.success){
                
                console.log(verifyRes.data.success,"correct");
                h3.textContent = 'Link is send to your email check';
                h3.style.color
            }
            else{
                console.log(verifyRes.data.message,"wrong");
                h3.textContent = 'Retry again something went wrong'
                h3.style.color = 'red';
            }
            div.appendChild(h3);
    }
    catch(err){
        div.innerHTML = '';
        h3.textContent = err?.response?.data?.message;
        h3.style.color = 'red';
        div.appendChild(h3);
        console.log(err.response.data.message);
    }
});
return container;
}