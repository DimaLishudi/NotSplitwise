// let fakeJSON = [
//     {
//     event_id: 1,
//     from: name1,
//     to: name2,
//     amount: 234,
// },
// {
//     event_id: 2,
//     from: name2,
//     to: name3,
//     amount: 152,
// },


const username = localStorage.getItem("username");
const user_id = localStorage.getItem("user_id")
const eventSection = document.getElementById("currentEvent");
const eventTable = document.createElement("table");


const currentUrl = window.location.href;
const lastUrl = currentUrl.split('/').pop();
const origin = window.location.origin + "/";
const api_url = origin + "api/events/" + lastUrl;

if (username === null) {
    window.location.href = origin + "signup.html";
}


function displayPaidSpentRow(item) {
    const row = eventTable.insertRow();
    for (let key of ["username", "spent", "paid"]) {
        const cell = row.insertCell();
        const input = document.createElement("input");

        if (key == "username") {
            input.readOnly = true;
        }
        input.type = "text";
        input.name = key;
        input.placeholder = key;
        input.value = item[key];
        cell.appendChild(input);
    };
}

function displayPaidSpentTable(data) {
    let isUserinBase = false;

    data.users.forEach(item => {
        console.log(item.username);
        console.log(username);
        if (item.username.toLowerCase() === username.toLowerCase()) {
            isUserinBase = true;
        }

        displayPaidSpentRow(item);
    });

    if (!isUserinBase) {
        console.log("add new user")
        const newRow = {username, user_id, spent: "", paid: ""}
        data.users.push(newRow);
        displayPaidSpentRow(newRow)
    }
}

fetch(api_url)
    .then(res => res.json())
    .then(displayPaidSpentTable)
    .then(() => {
        const sendButton = document.createElement("button");
        sendButton.textContent = "Save Changes";
        sendButton.addEventListener("click", () => {
            const updatedData = [];
            for (let row of eventTable.rows) {
                const rowData = {};
                for (let cell of row.cells) {
                    const input = cell.querySelector("input");
                    if (input) {
                        rowData[input.name] = input.value;
                    }
                }
                updatedData.push(rowData);
            }

            console.log(updatedData);
            fetch(api_url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedData)
            })
            .then(response => {
                if (response.ok) {
                    console.log("Your data has been updated");
                } else {
                    console.error("Error updating data");
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
        });

        eventSection.appendChild(eventTable);
        eventSection.appendChild(sendButton);
    })
    .catch((error) => {
        console.error('Error:', error);
    });


// final calculation of debts

document.getElementById("final").addEventListener("click", showDebts);

function showDebts(event) {
    event.preventDefault();

    document.querySelectorAll("#currentEvent input").forEach(input => {
        input.readOnly = true;
    });

    fetch(api_url, {method: "POST"})
    .then(res => res.json())
    .then((dataJson) => {
    //    const finalCalculation = JSON.parse(dataJson);

       const finalSection = document.getElementById("final");
       const debtsTable = document.createElement("table");

       dataJson.forEach(item => {
        const row = debtsTable.insertRow();
        Object.values(item).forEach(text => {
          const cell = row.insertCell();
          cell.textContent = text;
        });
      });
      
      finalSection.appendChild(debtsTable);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


