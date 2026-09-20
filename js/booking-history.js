import {
    getBookingsByHotel,
    cancelBooking,
    getHotelById,
    getRoomById
} from "./services/bookingService.js";


const urlParams =
    new URLSearchParams(window.location.search);

const HOTEL_ID =
    urlParams.get("hotelId");


async function loadBookingHistory() {

    try {

        const container =
            document.getElementById("bookingList");

        if (!HOTEL_ID) {

            container.innerHTML =
                "<p>Hotel ID is missing.</p>";

            return;
        }


        // Get bookings for selected hotel
        const bookings =
            await getBookingsByHotel(HOTEL_ID);


        // Extra safety check
        const hotelBookings =
            bookings.filter(
                booking =>
                    String(booking.hotelId) ===
                    String(HOTEL_ID)
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
                await getHotelById(
                    booking.hotelId
                );


            const room =
                await getRoomById(
                    booking.roomId
                );


            const card =
                document.createElement("div");


            card.className =
                "booking-card";


            const checkInDate =
                new Date(
                    booking.checkIn
                ).toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            const checkOutDate =
                new Date(
                    booking.checkOut
                ).toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            const bookingDate =
                new Date(
                    booking.bookingDate
                ).toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


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
                    ₹${Number(
                        booking.totalAmount
                    ).toLocaleString("en-IN")}
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

                    ? `
                        <button
                            class="cancel-btn"
                            data-id="${booking.id}">
                            Cancel Booking
                        </button>
                    `

                    : `
                        <button
                            class="cancel-btn"
                            disabled>
                            Cancelled
                        </button>
                    `
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
        document.querySelectorAll(
            ".cancel-btn:not([disabled])"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const bookingId =
                    button.dataset.id;


                const confirmCancel =
                    confirm(
                        "Are you sure you want to cancel this booking?"
                    );


                if (!confirmCancel) return;


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