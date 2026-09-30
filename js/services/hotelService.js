import axios from "https://cdn.jsdelivr.net/npm/axios@1.7.9/+esm";
const API_URL = "https://typicode.com";
export const getHotels = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};