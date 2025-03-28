console.log("aadi shankar")
const API_URL = "http://localhost:8080/api"; // Backend URL

async function loginUser(event) {
    event.preventDefault(); // Prevents form from refreshing the page

    // Get input values from the form
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful!");
            localStorage.setItem("token", data.token); // Store the token
            window.location.href = "index.html"; // Redirect to the main page
        } else {
            alert("Login failed: " + data.message);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
    }
}

// Attach event listener to login form when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", loginUser);
    }
});
async function fetchPlacements() {
    const token = localStorage.getItem("token"); // Retrieve token from storage
    if (!token) {
        alert("You are not logged in!");
        window.location.href = "login.html"; // Redirect to login if no token
        return;
    }

    try {
        const response = await fetch(`${API_URL}/placement`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        });

        const data = await response.json();
        const tableBody = document.getElementById("placement-table-body");

        tableBody.innerHTML = ""; // Clear table before adding new data

        data.forEach(placement => {
            const row = `<tr>
                <td>${placement.serialNo}</td>
                <td>${placement.studentId}</td>
                <td>${placement.name}</td>
                <td>${placement.status}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching placement data:", error);
        alert("Failed to fetch data.");
    }
}

// Load placements when `index.html` loads
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("placement-table-body")) {
        fetchPlacements();
    }
});
