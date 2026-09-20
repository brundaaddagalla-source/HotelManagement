import {
    getBookingsByHotel,
    cancelBooking,
    getHotelById,
    getRoomById
} from "./services/bookingService.js";

const urlParams = new URLSearchParams(window.location.search);
const HOTEL_ID = urlParams.get("hotelId");


async function loadBookingHistory() {

    try {

        const container = document.getElementById("bookingList");

        if (!HOTEL_ID) {
            container.innerHTML =
                "<p>Hotel ID is missing.</p>";
            return;
        }

        // Get all bookings for this hotel
        const bookings = await getBookingsByHotel(HOTEL_ID);

        // Extra safety: show ONLY bookings for this hotel
        const hotelBookings = bookings.filter(
            booking =>
                String(booking.hotelId) === String(HOTEL_ID)
        );

        displayBookings(hotelBookings);

    } catch (error) {

        console.error(
            "Error loading booking history:",
            error
        );
    }
}


async function displayBookings(bookings) {

    const container =
        document.getElementById("bookingList");

    if (!container) return;

    container.innerHTML = "";

    if (bookings.length === 0) {

        container.innerHTML =
            "<p>No bookings found for this hotel.</p>";

        return;
    }


    for (const booking of bookings) {

        try {

            const hotel =
                await getHotelById(booking.hotelId);

            const room =
                await getRoomById(booking.roomId);


            const card =
                document.createElement("div");

            card.className = "booking-card";


            card.innerHTML = `

                <h2>${hotel.name}</h2>

                <p>
                    ${hotel.location}
                </p>

                <p>
                    <strong>Room:</strong>
                    ${room.roomNumber} • ${room.roomType}
                </p>

                <p>
                    <strong>Check-in:</strong>
                    ${booking.checkIn}
                </p>

                <p>
                    <strong>Check-out:</strong>
                    ${booking.checkOut}
                </p>

                <p>
                    <strong>Guests:</strong>
                    ${booking.guests}
                </p>

                <p>
                    <strong>Total Amount:</strong>
                    ₹${booking.totalAmount}
                </p>

                <p>
                    <strong>Booking Date:</strong>
                    ${booking.bookingDate}
                </p>

                <p>
                    <strong>Status:</strong>

                    <span class="status ${booking.status.toLowerCase()}">
                        ${booking.status}
                    </span>

                </p>

                ${
                    booking.status !== "Cancelled"
                    ? `
                        <button
                            class="cancel-btn"
                            data-id="${booking.id}">
                            Cancel Booking
                        </button>
                    `
                    : ""
                }

            `;


            container.appendChild(card);


        } catch (error) {

            console.error(
                `Error loading booking ${booking.id}:`,
                error
            );

        }
    }


    addCancelEvents();
}


function addCancelEvents() {

    const buttons =
        document.querySelectorAll(".cancel-btn");


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const bookingId =
                    button.dataset.id;


                const confirmed =
                    confirm(
                        "Are you sure you want to cancel this booking?"
                    );


                if (!confirmed) return;


                try {

                    await cancelBooking(
                        bookingId
                    );

                    alert(
                        "Booking cancelled successfully!"
                    );

                    loadBookingHistory();


                } catch (error) {

                    console.error(
                        "Error cancelling booking:",
                        error
                    );

                    alert(
                        "Failed to cancel booking."
                    );
                }

            }
        );

    });
}


document.addEventListener(
    "DOMContentLoaded",
    loadBookingHistory
);