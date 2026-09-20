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