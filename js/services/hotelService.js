import axios from "https://cdn.jsdelivr.net/npm/axios@1.7.9/+esm";

const API_URL = "https://brundaaddagalla-source.github.io/HotelManagement";

export const getHotels = async () => {
    const response = await axios.get(`${API_URL}/db.json`);
    return response.data.hotels;
};

export default API_URL;