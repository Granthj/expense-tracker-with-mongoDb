import { Expense } from "./Components/Expense.js";
import { Login } from "./Components/Login.js"
import { SignUp } from "./Components/SignUp.js";
import { ForgotPasswordLink } from "./Components/ForgotpasswordLink.js";
import { PasswordReset } from "./Components/PasswordReset.js";
import { Payment } from "./Components/Payment.js";
import { Navbar } from "./Components/Navbar.js";
import { Income } from "./Components/Income.js";
import { Report } from "./Components/Report.js";
import { Note } from "./Components/Note.js";
import { PremiumUser } from "./Components/PremiumUsers.js"

const app = document.getElementById("app");
const publicRoutes = ["/login", "/sign-up", "/password","/forgotpassword"];
function render(route) {
  app.innerHTML = "";

  const token = localStorage.getItem("token");

  if (!token && route !== "/login" && route !== "/sign-up" && route !== "/password" && route !== "/forgotpassword") {
    navigate("/login");
    return;
  }
   if (token && !publicRoutes.includes(route)) {
    app.appendChild(Navbar(navigate));
  }
  console.log("Rendering route:", route);
  switch (route) {
    case "/login":
      app.appendChild(Login(navigate));
      break;

    case "/sign-up":
      app.appendChild(SignUp(navigate));
      break;

    case "/password":
      app.appendChild(ForgotPasswordLink(navigate));
      break;

    case "/forgotpassword":
      app.appendChild(PasswordReset(navigate));
      break;

    case "/dashboard":
    case "/":
      app.appendChild(Expense(navigate));
      break;

    case "/payment":
      app.appendChild(Payment(navigate));
      break;

    case "/add-income":
      app.appendChild(Income(navigate));
      break;

    case "/add-note":
      app.appendChild(Note(navigate));
      break;

    case "/report":
      app.appendChild(Report(navigate));
      break;

    case "/premium-users":
      app.appendChild(PremiumUser(navigate));
      break;

    default:
      app.innerHTML = "<h2>404 Page Not Found</h2>";
  }
}

export function navigate(route) {
  window.history.pushState({}, "", route);
  render(route);
}

window.addEventListener("popstate", () => {
  render(window.location.pathname);
});

function init() {
  const token = localStorage.getItem("token");
  const currentRoute = window.location.pathname;  

  if (!token && !publicRoutes.includes(currentRoute)) {
    render("/login");
  } else {
    render(currentRoute || "/dashboard");
  }
}

init();