import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.7/+esm";
import API_URL from "./apiConfig.js";

import { ApiException } from "../../exception/apiException.js";


export async function getRoomsByHotel(hotelId) {

    try {

        const response = await axios.get(
            `${API_URL}/rooms?hotelId=${hotelId}`
        );

        return response.data;

    } catch (error) {

        throw new ApiException(
            "Unable to load rooms"
        );
    }
}