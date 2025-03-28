document.addEventListener("DOMContentLoaded", function () {
    fetchPlacements();
});

function fetchPlacements() {
    fetch("http://localhost:8080/api/placements")  // API call to backend
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("placementTableBody");
            tableBody.innerHTML = ""; // Clear old data

            if (data.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='4'>No placement records found</td></tr>";
                return;
            }

            data.forEach((placement, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${placement.studentId}</td>
                        <td>${placement.name}</td>
                        <td>${placement.status}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error("Error fetching placements:", error));
}
