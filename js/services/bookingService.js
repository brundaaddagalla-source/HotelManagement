import {
    loadDb,
    getAllBookings,
    getAllUsers,
    saveBooking,
    patchBooking
} from "./dataStore.js";
import { ApiException } from "../../exception/apiException.js";

const same = (a, b) => String(a) === String(b);

export async function getBookings() {
    try {
        return await getAllBookings();
    } catch (error) {
        throw new ApiException("Unable to load bookings");
    }
}
export async function getBookingsByUser(userId) {
    try {
        return (await getAllBookings()).filter(b => same(b.userId, userId));
    } catch (error) {
        throw new ApiException("Unable to load booking history");
    }
}
export async function getBookingsByHotel(hotelId) {
    try {
        return (await getAllBookings()).filter(b => same(b.hotelId, hotelId));
    } catch (error) {
        throw new ApiException("Failed to fetch hotel bookings");
    }
}
export async function getBookingsByRoom(roomId) {
    try {
        return (await getAllBookings()).filter(b => same(b.roomId, roomId));
    } catch (error) {
        throw new ApiException("Unable to check room availability");
    }
}
export async function cancelBooking(bookingId) {
    try {
        return await patchBooking(bookingId, { status: "Cancelled" });
    } catch (error) {
        throw new ApiException("Unable to cancel booking");
    }
}
export async function getHotelById(hotelId) {
    try {
        const db = await loadDb();
        const hotel = db.hotels.find(h => same(h.id, hotelId));
        if (!hotel) throw new Error("not found");
        return hotel;
    } catch (error) {
        throw new ApiException("Unable to load hotel details");
    }
}
export async function getRoomById(roomId) {
    try {
        const db = await loadDb();
        const room = db.rooms.find(r => same(r.id, roomId));
        if (!room) throw new Error("not found");
        return room;
    } catch (error) {
        throw new ApiException("Unable to load room details");
    }
}
export async function getUserById(userId) {
    try {
        const user = (await getAllUsers()).find(u => same(u.id, userId));
        if (!user) throw new Error("not found");
        return user;
    } catch (error) {
        throw new ApiException("User not found");
    }
}
export async function createBooking(bookingData) {
    try {
        return await saveBooking(bookingData);
    } catch (error) {
        throw new ApiException("Unable to create booking");
    }
}
