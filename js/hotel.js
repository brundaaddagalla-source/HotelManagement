import { getHotels } from "./services/hotelService.js";

let hotels = [];

async function loadHotels() {
    try {
        hotels = await getHotels();

        console.log("Hotels:", hotels);

        displayHotels(hotels);
        loadLocations();
    } catch (error) {
        console.log("Error loading hotels:", error);
    }
}

function displayHotels(hotels) {
    const container = document.getElementById("hotelContainer");

    container.innerHTML = "";

    hotels.forEach(hotel => {
        container.innerHTML += `
            <div class="hotel-card">

                <img
                    src="../${hotel.image}"
                    alt="${hotel.name}"
                    class="hotel-image"
                    onerror="this.style.display='none'"
                >

                <h3>${hotel.name}</h3>

                <p>📍 ${hotel.location}</p>

                <p>⭐ ${hotel.rating}</p>

                <p>₹${hotel.price} per night</p>

            </div>
        `;
    });
}

function loadLocations() {
    const locationFilter = document.getElementById("locationFilter");

    const locations = [...new Set(
        hotels.map(hotel => hotel.location)
    )];

    locations.forEach(location => {
        locationFilter.innerHTML += `
            <option value="${location}">
                ${location}
            </option>
        `;
    });
}

function filterHotels() {
    const searchText =
        document.getElementById("searchInput").value.toLowerCase();

    const location =
        document.getElementById("locationFilter").value;

    const filteredHotels = hotels.filter(hotel => {

        const matchesSearch =
            hotel.name.toLowerCase().includes(searchText);

        const matchesLocation =
            location === "" || hotel.location === location;

        return matchesSearch && matchesLocation;
    });

    displayHotels(filteredHotels);
}

document.getElementById("searchInput")
    .addEventListener("input", filterHotels);

document.getElementById("locationFilter")
    .addEventListener("change", filterHotels);

loadHotels();