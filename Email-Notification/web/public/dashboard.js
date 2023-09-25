const API_URL = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", function () {
  fetch(`${API_URL}/vehicle`) // Replace with your API endpoint
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("tbody");
      data.forEach((vehicle) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${vehicle.vehicle_no}</td>
                    <td>${new Date(vehicle.entry_time).toLocaleString()}</td>
                `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
