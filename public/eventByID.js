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

if (username === null) {
    window.location.href = origin + "sign_in.html";
}

const currentUrl = window.location.href;
let lastUrl = currentUrl.split('/').pop();
const origin = window.location.origin + "/";
const api_url = origin + "api/events/" + lastUrl;



function displayPaidSpentRow(item) {
    const row = eventTable.insertRow();
    for (let key of ["use   rname", "paid", "spent"]) {
        const cell = row.insertCell();
        const input = document.createElement("input");
        input.type = "text";
        input.name = key;
        input.value = item[key];
        cell.appendChild(input);
    };
}

function displayPaidSpentTable(data) {
    console.log(data);
    let isUserinBase = false;

    data.users.forEach(item => {
        if (item.username === username) {
            isUserinBase = true;
        }

        displayPaidSpentRow(item);
    });

    if (!isUserinBase) {
        const newRow = {username, user_id, spent: 0, paid: 0}
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


