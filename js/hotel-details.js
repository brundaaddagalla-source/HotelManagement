import { getHotels } from "./services/hotelService.js";
import { getRoomsByHotel } from "./services/roomService.js";
const hotelDetails = document.getElementById("hotelDetails");
const backBtn = document.getElementById("backBtn");
const urlParams = new URLSearchParams(window.location.search);
const hotelId = urlParams.get("id");
backBtn.addEventListener("click", function () {
    window.location.href = "index.html";
}
);
async function loadHotel() {
    try {
        if (!hotelId) {
            showError("Hotel information is missing.");
            return;
        }
        const hotels = await getHotels();
        const hotel = hotels.find(hotel => String(hotel.id) === String(hotelId));
        if (!hotel) {
            showError("Hotel not found.");
            return;
        }
        let rooms = [];
        try {
            rooms = await getRoomsByHotel(hotelId);
        } catch (error) {
            console.log("Unable to load room count:", error);
        }
        displayHotel(hotel, rooms);
    } catch (error) {
        console.log("Error loading hotel:", error);
        showError("Unable to load hotel details.");
    }
}
function displayHotel(hotel, rooms) {
    const availableRooms = rooms.filter(room => room.status === "Available");
    hotelDetails.innerHTML = `
        <section class="hotel-detail-card">
            <div class="hotel-main">
                <div>
                    <img
                        src="../${hotel.image}"
                        alt="${hotel.name}"
                        class="hotel-detail-image"
                        onerror="this.style.display='none'"
                    >
                </div>
                <div class="hotel-info">
                    <h2>${hotel.name}</h2>
                    <p>📍${hotel.location}</p>
                    <p class="hotel-rating">⭐${hotel.rating}</p>
                    <p class="hotel-price">₹${hotel.price}per night</p>
                    <p>🏨 Comfortable stay with modern facilities and convenient location.</p>
                </div>
            </div>
            <div class="hotel-description">
                <h3> About ${hotel.name} </h3>
                <p> ${hotel.description || `Welcome to ${hotel.name},
                    located in ${hotel.location}.
                    Enjoy a comfortable and
                    relaxing stay with excellent
                    hospitality, convenient
                    facilities and easy access
                    to nearby attractions.`}
                </p>
            </div>
            <div class="hotel-information">
                <h3> Hotel Information </h3>
                <div class="hotel-info-grid">
                    <div class="info-box">
                        <strong>Location </strong>
                        <span> ${hotel.location}</span>
                    </div>
                    <div class="info-box">
                        <strong>Rating</strong>
                        <span>⭐ ${hotel.rating}</span>
                    </div>
                    <div class="info-box">
                        <strong>Starting Price </strong>
                        <span>₹${hotel.price}/ night </span>
                    </div>
                </div>
            </div>
            <div class="amenities">
                <h3>Amenities</h3>
                <div class="amenities-list">
                ${
                hotel.amenities.map(amenity => {
                const icons = {
                    "Free Wi-Fi": "📶",
                    "Swimming Pool": "🏊",
                    "Restaurant": "🍽️",
                    "Parking": "🚗",
                    "Room Service": "🛎️",
                    "Gym": "🏋️",
                    "Spa": "💆",
                    "Airport Shuttle": "🚐",
                    "Garden": "🌳",
                    "Beach Access": "🏖️",
                    "Mountain View": "🏔️",
                    "Lake View": "🌊",
                    "River View": "🌊",
                    "Conference Hall": "🏢",
                    "Business Center": "💼",
                    "Fireplace": "🔥",
                    "Water Sports": "🏄",
                    "Campfire": "🔥",
                    "Bar": "🍹",
                    "Room Service": "🛎️"
                };
                return `
                    <span class="amenity">
                        ${icons[amenity] || "✓"} ${amenity}
                    </span>
                `;
                }).join("")
                }
                </div>
            </div>
            <div class="rooms-summary">
                <div>
                    <h3>Rooms</h3>
                    <p>${availableRooms.length} room(s) currently available</p>
                </div>
                <strong> ${rooms.length} Total Rooms </strong>
            </div>
            <div class="hotel-actions">
                <button
                class="view-history-btn"
                id="viewHistoryBtn"
                >
                View History
                </button>
                <button
                    class="view-rooms-btn"
                    id="viewRoomsBtn"
                >
                    View Rooms
                </button>
            </div>
        </section>
    `;
    document
        .getElementById("viewRoomsBtn")
        .addEventListener("click", function () {
            window.location.href =`room-selection.html?hotelId=${hotelId}`;});
    document
        .getElementById("viewHistoryBtn")
        .addEventListener("click", function () {
            window.location.href =
                `booking-history.html?hotelId=${hotelId}`;
        });

}
function showError(message) {
    hotelDetails.innerHTML = `
        <div class="error-message">
            <h2>${message}</h2>
            <button
                class="view-rooms-btn"
                onclick="window.location.href='index.html'"
            >
                Back to Hotels
            </button>
        </div>
    `;
}
loadHotel();