const createEvent = document.getElementById("createEvent");
createEvent.addEventListener("click", showLink)
const divEvent = document.getElementById("divEvent")

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

