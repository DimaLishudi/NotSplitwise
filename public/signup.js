const origin = window.location.origin + "/";
document.getElementById("signup").addEventListener("submit", sendNewUser);


async function sendNewUser(event) {
    event.preventDefault();

    const form = event.target;
    const username = form.username.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const newUser = {
        username,
        password
    };

    try {
        const response = await fetch(origin + "api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        });

        const data = await response.json();
        if (response.status == 200) {
            alert("User created successfully!");
        } else {
            alert("Error creating user: " + data);
        }
    } catch(error) {
            console.error("Error:", error);
    };
}