const currentUrl = window.location.href;

let lastUrl = currentUrl.split('/').pop();

fetch("api/events/" + lastUrl)
    .then((res) => res.json())
    .then((dataJson) => {
        const dataReceived = JSON.parse(dataJson);

        const eventSection = document.getElementById("currentEvent");
        const eventTable = document.createElement("table");

        dataReceived.users.forEach(item => {
            const row = table.insertRow();
            Object.values(item).forEach(text => {
              const cell = row.insertCell();
              const input = document.createElement("input");
                input.type = "text";
                input.name = key;
                input.value = item[key];
                cell.appendChild(input);
            });
        });


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
        const row = table.insertRow();
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
