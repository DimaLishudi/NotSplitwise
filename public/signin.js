// for signin page:

document.getElementById("signin").addEventListener("submit", sendNewUser);


function sendNewUser(event) {
    event.preventDefault();


    const form = event.target;
    const username = form.username.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    console.log(form);

    const formdata = (new FormData(form));
    console.log(formdata);
    console.log(formdata.get(""));

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const newUser = {
        username: username,
        password: password
    };

 
    fetch("/api/register", { // какой API тут наш?
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("User created successfully!");
        } else {
            alert("Error creating user: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}