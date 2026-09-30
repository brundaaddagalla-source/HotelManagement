import { loadDb } from "./dataStore.js";
import { ApiException } from "../../exception/apiException.js";

export async function getRoomsByHotel(hotelId) {
    try {
        const db = await loadDb();
        return db.rooms.filter(r => String(r.hotelId) === String(hotelId));
    } catch (error) {
        throw new ApiException("Unable to load rooms");
    }
}
