let map;
let input;
let marker;

function initMap() {
    map = L.map('map').setView([-34.397, 150.644], 8); // Initial view on Sydney

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    input = document.getElementById("searchInput");
    input.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchLocation();
        }
    });

    hideLoadingScreen();
}

async function searchLocation() {
    const searchTerm = input.value;
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTerm)}&format=json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.length > 0) {
            const result = data[0];
            const lat = parseFloat(result.lat);
            const lon = parseFloat(result.lon);

            map.setView([lat, lon], 15);

            if (marker) {
                marker.setLatLng([lat, lon]);
            } else {
                marker = L.marker([lat, lon]).addTo(map);
            }

            marker.bindPopup(result.display_name).openPopup();
        } else {
            alert("Location not found");
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert("An error occurred while searching for the location.");
    }
}

function hideLoadingScreen() {
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("searchInput").style.display = "block";
    document.getElementById("map").style.display = "block";
}

// Initialize the map when the page loads
window.onload = initMap;
