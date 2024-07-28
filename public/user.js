const currentUrl = window.location.href;

// let lastUrl = currentUrl.split('/').pop();

if (!userName) {
  console.error("User not found in local storage.");
  window.location.href = "login.html"; 
} else {
      fetch("api/users/" + userName) 
          .then((res) => res.json())
          .then((dataJson) => {
              const userData = JSON.parse(dataJson);      

              const userSection = document.getElementById("summaryForUser");
              const userTable = document.createElement("table");      

              userData.forEach(item => {
                  const row = table.insertRow();
                  Object.values(item).forEach(text => {
                    const cell = row.insertCell();
                    cell.textContent = text;
                  });
                });
             userSection.appendChild(userTable);
           });
           .catch((error) => {
            console.error("Error:", error);
        });
}
