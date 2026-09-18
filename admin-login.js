const loginForm =
    document.getElementById("loginForm");

const loginError =
    document.getElementById("loginError");


loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value;

        const password =
            document.getElementById("password").value;


        if (
            username === "admin" &&
            password === "admin123"
        ) {

            window.location.href =
                "admin.html";

        } else {

            loginError.textContent =
                "Invalid username or password.";

        }

    }
);