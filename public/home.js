document.addEventListener("DOMContentLoaded", () => {
    const createEvent = document.getElementById("createEvent");
    createEvent.addEventListener("click", showLink);
    const divEvent = document.getElementById("divEvent")

    let username = localStorage.getItem("username")

    if (username) {
        document.getElementById('greeting').textContent = `Hi ${username}!`;
    } else {
        document.getElementById('greeting').textContent = 'Hi guest!';
    }


    function showLink(event) {
        event.preventDefault()
        fetch("/api/events", {
            credentials: "same-origin",
            mode: "same-origin",
            method: "post",
        })
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            const userLink = document.createElement("a");
            userLink.setAttribute("href", "/api/events/" + data.id);
            userLink.innerHTML = "This is your events link: <br>" + "/api/events/" + data.id;
            divEvent.appendChild(userLink)

            window.location.replace("/events/" + data.id);
        })
        .catch(err => {
            console.log(err)
        });
    }

    fetch('КАКОЙ ТУТ У НАС ПУТЬ?')
        .then(response => response.json())
        .then(data => {

            const tableDebts = document.getElementById('tableDebts').getElementsByTagName('tbody')[0];
            data.debts.forEach(debt => {
                const row = tableDebts.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                cell1.textContent = debt.username;
                cell2.textContent = debt.amount;
            });

            const tableUsersEvents = document.getElementById('tableUsersEvents').getElementsByTagName('tbody')[0];
            data.events.forEach(eventID => {
                const row = tableUsersEvents.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                cell1.textContent = eventID;
                const link = document.createElement('a');
                link.setAttribute('href', `/event/${eventID}`);
                link.textContent = `/event/${eventID}`;
                cell2.appendChild(link);
            });
        })
        .catch(error => {
            console.error('Error fetching JSON data:', error);
        });
});