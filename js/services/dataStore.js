// GitHub Pages can only serve static files, so there is no json-server API.
// We read db.json once, filter in JavaScript, and keep any changes the user
// makes (new bookings, cancellations, new users) in localStorage.
import DB_URL from "./apiConfig.js";
import { ApiException } from "../../exception/apiException.js";

const LS_KEY = "hotelManagementChanges";
let dbPromise = null;

export function loadDb() {
    if (!dbPromise) {
        dbPromise = fetch(DB_URL).then(res => {
            if (!res.ok) {
                throw new ApiException(`Unable to load db.json (${res.status})`);
            }
            return res.json();
        }).catch(err => {
            dbPromise = null; // allow a retry next time
            throw err;
        });
    }
    return dbPromise;
}

function readChanges() {
    try {
        const saved = JSON.parse(localStorage.getItem(LS_KEY));
        return {
            newBookings: saved?.newBookings || [],
            bookingPatches: saved?.bookingPatches || {},
            newUsers: saved?.newUsers || []
        };
    } catch {
        return { newBookings: [], bookingPatches: {}, newUsers: [] };
    }
}

function writeChanges(changes) {
    localStorage.setItem(LS_KEY, JSON.stringify(changes));
}

export async function getAllBookings() {
    const db = await loadDb();
    const changes = readChanges();
    return [...db.bookings, ...changes.newBookings].map(b => ({
        ...b,
        ...(changes.bookingPatches[String(b.id)] || {})
    }));
}

export async function getAllUsers() {
    const db = await loadDb();
    return [...db.users, ...readChanges().newUsers];
}

export async function saveBooking(bookingData) {
    const all = await getAllBookings();
    const nextId = String(
        Math.max(0, ...all.map(b => Number(b.id) || 0)) + 1
    );
    const booking = { ...bookingData, id: nextId };
    const changes = readChanges();
    changes.newBookings.push(booking);
    writeChanges(changes);
    return booking;
}

export async function patchBooking(id, patch) {
    const all = await getAllBookings();
    const existing = all.find(b => String(b.id) === String(id));
    if (!existing) throw new ApiException("Booking not found");
    const changes = readChanges();
    const key = String(id);
    const isNew = changes.newBookings.find(b => String(b.id) === key);
    if (isNew) {
        Object.assign(isNew, patch);
    } else {
        changes.bookingPatches[key] = {
            ...(changes.bookingPatches[key] || {}),
            ...patch
        };
    }
    writeChanges(changes);
    return { ...existing, ...patch };
}

export async function saveUser(userData) {
    const all = await getAllUsers();
    const nextId = Math.max(0, ...all.map(u => Number(u.id) || 0)) + 1;
    const user = { ...userData, id: nextId };
    const changes = readChanges();
    changes.newUsers.push(user);
    writeChanges(changes);
    return user;
}