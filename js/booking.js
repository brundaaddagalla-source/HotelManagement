import {
    getBookingsByUser,
    cancelBooking,
    getHotelById,
    getRoomById
} from "./services/bookingService.js";

const USER_ID = 1;

// Load booking history
async function loadBookingHistory() {
    try {
        const bookings = await getBookingsByUser(USER_ID);

        console.log("My bookings:", bookings);

        displayBookings(bookings);
    } catch (error) {
        console.error("Error loading bookings:", error);
    }
}

// Display bookings on the page
async function displayBookings(bookings) {
    const container = document.getElementById("bookingList");

    if (!container) return;

    container.innerHTML = "";

    if (bookings.length === 0) {
        container.innerHTML = "<p>No bookings found.</p>";
        return;
    }

    for (const booking of bookings) {
        try {
            const hotel = await getHotelById(booking.hotelId);
            const room = await getRoomById(booking.roomId);

            const card = document.createElement("div");
            const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });

            const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
            const bookingDate = new Date(booking.bookingDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
});

            card.className = "booking-card";

            card.innerHTML = `
                <h3>${hotel.name}</h3>

                <p class="location">
                    ${hotel.location}
                </p>

                <p>
                    <strong>Room:</strong>
                    ${room.roomNumber} • ${room.roomType}
                </p>

                <p>
                    <strong>Check-in:</strong>
                    ${checkInDate}
                </p>

                <p>
                    <strong>Check-out:</strong>
                    ${checkOutDate}
                </p>

                <p>
                    <strong>Guests:</strong>
                    ${booking.guests}
                </p>

                <p>
                    <strong>Total Amount:</strong>
                   ₹${booking.totalAmount.toLocaleString("en-IN")}
                </p>

                <p>
                    <strong>Booking Date:</strong>
                    ${bookingDate}
                </p>

                <p>
                    <strong>Status:</strong>
                    <span class="status ${booking.status.toLowerCase()}">
    ${booking.status}
</span>
                </p>

                ${
                    booking.status !== "Cancelled"
                        ? `<button class="cancel-btn" data-id="${booking.id}">
                            Cancel Booking
                           </button>`
                        : `<button class="cancel-btn" disabled>
                            Cancelled
                           </button>`
                }
            `;

            container.appendChild(card);

        } catch (error) {
            console.error(
                `Error loading details for booking ${booking.id}:`,
                error
            );
        }
    }

    addCancelEvents();
}


// Add cancel button events
function addCancelEvents() {
    const buttons = document.querySelectorAll(".cancel-btn:not([disabled])");

    buttons.forEach(button => {
        button.addEventListener("click", async () => {
            const bookingId = button.dataset.id;

            const confirmCancel = confirm(
                "Are you sure you want to cancel this booking?"
            );

            if (!confirmCancel) return;

            try {
                await cancelBooking(bookingId);

                alert("Booking cancelled successfully!");

                loadBookingHistory();
            } catch (error) {
                console.error("Error cancelling booking:", error);
                alert("Failed to cancel booking.");
            }
        });
    });
}

// Run when page loads
document.addEventListener("DOMContentLoaded", loadBookingHistory);