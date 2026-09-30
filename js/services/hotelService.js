import { loadDb } from "./dataStore.js";

export const getHotels = async () => {
    const db = await loadDb();
    return db.hotels;
};

export default getHotels;
