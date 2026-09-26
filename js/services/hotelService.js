import axios from "https://cdn.jsdelivr.net/npm/axios@1.7.9/+esm";
const API_URL = "http://localhost:3000/hotels";
export const getHotels = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};