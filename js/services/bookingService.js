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
import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.7/+esm";
import API_URL from "./apiConfig.js";

import { ApiException } from "../../exception/apiException.js";


export async function getRoomById(roomId) {

    try {

        const response = await axios.get(
            `${API_URL}/rooms/${roomId}`
        );

        return response.data;

    } catch (error) {

        throw new ApiException(
            "Unable to load room details"
        );
    }
}


export async function getBookingsByRoom(roomId) {

    try {

        const response = await axios.get(
            `${API_URL}/bookings?roomId=${roomId}`
        );

        return response.data;

    } catch (error) {

        throw new ApiException(
            "Unable to check room availability"
        );
    }
}


export async function getUserById(userId) {

    try {

        const response = await axios.get(
            `${API_URL}/users/${userId}`
        );

        return response.data;

    } catch (error) {

        throw new ApiException(
            "User not found"
        );
    }
}


export async function createBooking(bookingData) {

    try {

        const response = await axios.post(
            `${API_URL}/bookings`,
            bookingData
        );

        return response.data;

    } catch (error) {

        throw new ApiException(
            "Unable to create booking"
        );
    }
}