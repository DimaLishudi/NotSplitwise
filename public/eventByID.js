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


const username = localStorage.getItem("user_name");
const user_id = localStorage.getItem("user_id")
const eventSection = document.getElementById("currentEvent");
const eventTable = document.createElement("table");
const origin = window.location.origin + "/";


function displayPaidSpentRow(item) {
    const row = eventTable.insertRow();
    Object.keys(item).forEach(key => {
        const cell = row.insertCell();
        const input = document.createElement("input");
        input.type = "text";
        input.name = key;
        input.value = item[key];
        cell.appendChild(input);
    });
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

if (username === null) {
    window.location.href = origin + "sign_in.html";
}

const currentUrl = window.location.href;

let lastUrl = currentUrl.split('/').pop();

fetch(origin + "api/events/" + lastUrl)
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


            console.log("Updated data to be sent:", JSON.stringify(updatedData));

            fetch("api/events/" + lastUrl, {
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

    fetch("/api/finalise" + lastUrl, {method: "POST"}) // или какая апишечка у нас?
    .then((res) => res.json())
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


