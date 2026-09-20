import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.7/+esm";

import API_URL from "./apiConfig.js";

import { ApiException } from "../../exception/apiException.js";


// ==================== GET ALL BOOKINGS ====================

export async function getBookings() {

    try {

        const response = await axios.get(
            `${API_URL}/bookings`
        );

        return response.data;

    } catch (error) {

        throw new ApiException(
            "Unable to load bookings"
        );

    }
}


// ==================== GET BOOKINGS BY USER ====================

export async function getBookingsByUser(userId) {

    try {

        const response = await axios.get(
            `${API_URL}/bookings?userId=${userId}`
        );

        return response.data;

    } catch (error) {

        throw new ApiException(
            "Unable to load booking history"
        );

    }
}

export async function getBookingsByHotel(hotelId) {

    try {

        const response = await axios.get(
            `${API_URL}/bookings?hotelId=${hotelId}`
        );

        return response.data;

    } catch (error) {

        throw new ApiException(
            "Failed to fetch hotel bookings."
        );
    }
}


// ==================== CANCEL BOOKING ====================

export async function cancelBooking(bookingId) {

    try {

        const response = await axios.patch(
            `${API_URL}/bookings/${bookingId}`,
            {
                status: "Cancelled"
            }
        );

        return response.data;

    } catch (error) {

        throw new ApiException(
            "Unable to cancel booking"
        );

    }
}


// ==================== GET HOTEL BY ID ====================

export async function getHotelById(hotelId) {

    try {

        const response = await axios.get(
            `${API_URL}/hotels/${hotelId}`
        );

        return response.data;

    } catch (error) {

        throw new ApiException(
            "Unable to load hotel details"
        );

    }
}


// ==================== GET ROOM BY ID ====================

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


// ==================== GET BOOKINGS BY ROOM ====================

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


// ==================== GET USER BY ID ====================

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


// ==================== CREATE BOOKING ====================

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
