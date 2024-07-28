// const express = require("express");

// const app = express();

// app.use 

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
   .then(dataJson => {
        dataReceived = JSON.parse(dataJson)
        const userLink = document.createElement("a");
        userLink.setAttribute("href", "/api/events/" + dataReceived.id);
        userLink.innerHTML = "This is your events link: <br>" + "/api/events/" + dataReceived.id;
        divEvent.appendChild(userLink)
    })
    .catch(err => {
        console.log(err)
    });
}

