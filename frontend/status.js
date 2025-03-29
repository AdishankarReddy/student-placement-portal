document.addEventListener("DOMContentLoaded", async () => {
    const placementList = document.getElementById("placementUpdates"); // Get the list container

    try {
        const response = await fetch("http://localhost:8080/api/placements");
        const placements = await response.json();

        if (placements.length > 0) {
            placementList.innerHTML = ""; // Clear existing data
            placements.forEach((placement) => {
                const listItem = document.createElement("li");
                listItem.textContent = `🎓 ${placement.name} - ${placement.status}`;
                placementList.appendChild(listItem);
            });
        } else {
            placementList.innerHTML = "<li>No placement records available</li>";
        }
    } catch (error) {
        console.error("Error fetching placement data:", error);
        placementList.innerHTML = "<li>Error loading placements</li>";
    }
});
