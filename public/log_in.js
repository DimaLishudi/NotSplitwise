const origin = window.location.origin + "/";

document.getElementById("loginForm").addEventListener("submit", sendToLogin);

async function sendToLogin(event) {
    event.preventDefault();

    const form = event.target;
    const username = form.username.value;
    const password = form.password.value;

    const currentUser = {
        username,
        password
    };

    try {
        const response = await fetch(origin + "api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(currentUser)
        })
        const data = await response.json();

        if (response.status == 200) {
            localStorage.setItem("username", data.username);
            localStorage.setItem("user_id", data.id);
            window.location.href = `user_page.html`;
        } else {
            alert("Something went wrong: " + data.message);
        }
    } catch(error) {
        console.error("Error:", error); 
    };
}

