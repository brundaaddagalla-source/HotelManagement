import axios from "https://cdn.jsdelivr.net/npm/axios@1.7.9/+esm";

// Fixed to use the full My JSON Server path for your repo
const API_URL = "https://brundaaddagalla-source.github.io/HotelManagement/db.json";

export const getHotels = async () => {
    // This now appends /hotels to your live base URL
    const response = await axios.get(`${API_URL}/hotels`);
    return response.data;
};

export default API_URL;
