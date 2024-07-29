const origin = window.location.origin + "/";

document.getElementById("loginForm").addEventListener("submit", sendToLogin);

function sendToLogin(event) {
    event.preventDefault();

    const form = event.target;
    const formdata = (new FormData(form));
    console.log(formdata);
    console.log(form);
    const username = form.username.value;
    const password = form.password.value;

    // TODO: check passwords are equal
    // else disable button

    const currentUser = {
        username,
        password
    };
    console.log(currentUser);

    fetch(origin + "api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(currentUser)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            localStorage.setItem("username", data.username);
            localStorage.setItem("user_id", data.id);
            window.location.href = `user_page.html`;
        } else {
            alert("Something went wrong: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error); 
    });
}

