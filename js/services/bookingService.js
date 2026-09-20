import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.7/+esm";

import API_URL from "./apiConfig.js";

import { ApiException } from "../../exception/apiException.js";


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
            "Failed to fetch hotel bookings"
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