import API_URL from "./apiConfig.js";

// Get all bookings
export async function getBookings() {
    const response = await fetch(`${API_URL}/bookings`);

    if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return await response.json();
}

// Get bookings for a specific user
export async function getBookingsByUser(userId) {
    const response = await fetch(`${API_URL}/bookings?userId=${userId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch user bookings");
    }

    return await response.json();
}

// Cancel a booking
export async function cancelBooking(bookingId) {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: "Cancelled"
        })
    });

    if (!response.ok) {
        throw new Error("Failed to cancel booking");
    }

    return await response.json();
}
// Get hotel details
export async function getHotelById(hotelId) {
    const response = await fetch(`${API_URL}/hotels/${hotelId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch hotel details");
    }

    return await response.json();
}

// Get room details
export async function getRoomById(roomId) {
    const response = await fetch(`${API_URL}/rooms/${roomId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch room details");
    }

    return await response.json();
}