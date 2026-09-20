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

                <button
                    class="view-hotel-btn"
                    onclick="window.location.href='hotel-details.html?id=${hotel.id}'"
                >
                    View Hotel
                </button>

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

    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const location = document.getElementById("locationFilter").value;
    const price = document.getElementById("priceFilter").value;

    const filteredHotels = hotels.filter(hotel => {

        const matchesSearch = hotel.name.toLowerCase().includes(searchText);
        const matchesLocation =location === "" || hotel.location === location;

        let matchesPrice = true;
        if (price !== "" && price !== "custom") {
            matchesPrice = hotel.price <= Number(price);
        }
        return ( matchesSearch && matchesLocation && matchesPrice);
    });
    displayHotels(filteredHotels);
}


document.getElementById("searchInput")
    .addEventListener("input", filterHotels);

document.getElementById("locationFilter")
    .addEventListener("change", filterHotels);

document.getElementById("priceFilter")
    .addEventListener("change", function () {
        if (this.value === "custom") {
            const min = Number(prompt("Enter minimum price:"));
            const max = Number(prompt("Enter maximum price:"));
            if (!isNaN(min) && !isNaN(max)) {
                const filteredHotels = hotels.filter(hotel => {
                    return hotel.price >= min && hotel.price <= max;
                });
                displayHotels(filteredHotels);
            }
            this.value = "";
        } else {
            filterHotels();
        }
    });

loadHotels();