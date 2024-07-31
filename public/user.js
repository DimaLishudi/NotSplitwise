const currentUrl = window.location.href;
const origin = window.location.origin + "/";

// let lastUrl = currentUrl.split('/').pop();

const id = localStorage.getItem("user_id");


if (!id) {
    console.error("User not found in local storage.");
    window.location.href = "login.html"; 
} else {
    fetch(origin + "api/users/" + id)
        .then((res) => res.json())
        .then((data) => {
            const userSection = document.getElementById("summaryForUser");
            const userTable = document.createElement("table");      

            data.debts.forEach(item => {
                const row = table.insertRow();
                Object.values(item).forEach(text => {
                const cell = row.insertCell();
                cell.textContent = text;
                });
            });
            userSection.appendChild(userTable);

            // TODO: add events (data.events)
        })
        .catch((error) => { console.error("Error:", error); });
}
