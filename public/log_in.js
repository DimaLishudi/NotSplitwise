document.getElementById("loginForm").addEventListener("submit", sendToLogin);

function sendToLogin(event) {
    event.preventDefault();

    const form = event.target;
    const userName = form.userName.value;
    const password = form.password.value;

    const currentUser = {
        userName: userName,
        password: password
    };

 
    fetch("/api/login", { // какой API тут наш?
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(currentUser)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("userName", data.username, "userId", data.id);
            // window.location.href = `user_page.html?id=${data.id}`;
            window.location.href = `user_page.html`;
        } else {
            alert("Something went wrong: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

