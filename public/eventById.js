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
// ]


const userName = localStorage.getItem("userName");
const userId = localStorage("userId")
const eventSection = document.getElementById("currentEvent");
const eventTable = document.createElement("table");


function forNewInput(item) {
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

if (userName != null) {
    alert("You should log in");
    window.location.href = "sign_in.html";
    throw new Error("You are not logged in.");

}
const currentUrl = window.location.href;

let lastUrl = currentUrl.split('/').pop();

fetch("api/events/" + lastUrl)
    .then((res) => res.json())
    .then((dataJson) => {
        const dataReceived = JSON.parse(dataJson);

// const dataReceived = fakeJSON;

        let isUserinBase = false;

        dataReceived.users.forEach(item => {
            if (item.username === userName) {
                isUserinBase = true;
            }

            forNewInput(item);
        });

        if (!isUserinBase) {
            dataReceived.push({userName: username, userId: userid, spent: 0, paid: 0});
            let newString = dataReceived[datdaReceived.length-1];
            // forNewInput(item);
            forNewInput(newString)
        }

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


