import {
    getBookingsByUser,
    cancelBooking,
    getHotelById,
    getRoomById,
    getBookingsByRoom,
    getUserById,
    createBooking
} from "./services/bookingService.js";
import { ValidationException } from "../exception/validationException.js";
import { handleError } from "../exception/errorHandler.js";
const USER_ID = 1;
async function loadBookingHistory() {
    try {
        const bookings = await getBookingsByUser(USER_ID);
        console.log("My bookings:", bookings);
        displayBookings(bookings);
    } catch (error) {
        console.error("Error loading bookings:", error);
    }
}
async function displayBookings(bookings) {
    const container = document.getElementById("bookingList");
    if (!container) return;
    container.innerHTML = "";
    if (bookings.length === 0) {
        container.innerHTML = "<p>No bookings found.</p>";
        return;
    }
    for (const booking of bookings) {
        try {
            const hotel = await getHotelById(booking.hotelId);
            const room = await getRoomById(booking.roomId);
            const card = document.createElement("div");
            const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
            const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
            const bookingDate = new Date(booking.bookingDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
            card.className = "booking-card";
            card.innerHTML = `
                <h3>${hotel.name}</h3>
                <p class="location">${hotel.location}</p>
                <p>
                    <strong>Room:</strong>
                    ${room.roomNumber} • ${room.roomType}
                </p>
                <p>
                    <strong>Check-in:</strong>
                    ${checkInDate}
                </p>
                <p>
                    <strong>Check-out:</strong>
                    ${checkOutDate}
                </p>
                <p>
                    <strong>Guests:</strong>
                    ${booking.guests}
                </p>
                <p>
                    <strong>Total Amount:</strong>
                    ₹${booking.totalAmount.toLocaleString("en-IN")}
                </p>
                <p>
                    <strong>Booking Date:</strong>
                    ${bookingDate}
                </p>
                <p>
                    <strong>Status:</strong>
                    <span class="status ${booking.status.toLowerCase()}">
                        ${booking.status}
                    </span>
                </p>
                ${
                    booking.status !== "Cancelled"
                        ? `<button class="cancel-btn" data-id="${booking.id}">
                            Cancel Booking
                           </button>`
                        : `<button class="cancel-btn" disabled>
                            Cancelled
                           </button>`
                }
            `;
            container.appendChild(card);
        } catch (error) {
            console.error(
                `Error loading details for booking ${booking.id}:`,
                error
            );
        }
    }
    addCancelEvents();
}
function addCancelEvents() {
    const buttons = document.querySelectorAll(".cancel-btn:not([disabled])");
    buttons.forEach(button => {
        button.addEventListener("click", async () => {
            const bookingId = button.dataset.id;
            const confirmCancel = confirm(
                "Are you sure you want to cancel this booking?"
            );
            if (!confirmCancel) return;
            try {
                await cancelBooking(bookingId);
                alert("Booking cancelled successfully!");
                loadBookingHistory();
            } catch (error) {
                console.error("Error cancelling booking:", error);
                alert("Failed to cancel booking.");
            }
        });
    });
}

const roomType = document.getElementById("roomType");
const roomNumber = document.getElementById("roomNumber");
const roomPrice = document.getElementById("roomPrice");
const roomCapacity = document.getElementById("roomCapacity");
const bookingForm = document.getElementById("bookingForm");
const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");
const guestsInput = document.getElementById("guests");
const totalAmount = document.getElementById("totalAmount");
const bookingMessage = document.getElementById("bookingMessage");
const urlParams = new URLSearchParams(window.location.search);
const hotelId = urlParams.get("hotelId");
const roomId = urlParams.get("roomId");
const selectedCheckIn = urlParams.get("checkIn");
const selectedCheckOut = urlParams.get("checkOut");
const selectedGuests = urlParams.get("guests");
let selectedRoom = null;
function getToday() {
    return new Date().toISOString().split("T")[0];
}
function createDate(dateString) {
    return new Date(`${dateString}T00:00:00`);
}
function setDateLimits() {
    if (!checkInInput || !checkOutInput) return;
    checkInInput.min = getToday();
    checkOutInput.min = getToday();
}
function updateCheckOutMinimum() {
    if (!checkInInput || !checkOutInput) return;
    if (!checkInInput.value) {
        checkOutInput.min = getToday();
        return;
    }
    const checkInDate = createDate(checkInInput.value);
    checkInDate.setDate(checkInDate.getDate() + 1);
    checkOutInput.min =
        checkInDate.toISOString().split("T")[0];
}
async function loadRoom() {
    try {
        if (!hotelId || !roomId) {
            throw new ValidationException(
                "Hotel or room information is missing."
            );
        }
        const hotelNumber = Number(hotelId);
        const roomNumberValue = Number(roomId);
        if (
            !Number.isInteger(hotelNumber) ||
            hotelNumber <= 0 ||
            !Number.isInteger(roomNumberValue) ||
            roomNumberValue <= 0
        ) {
            throw new ValidationException(
                "Invalid hotel or room information."
            );
        }
        selectedRoom = await getRoomById(roomId);
        if (Number(selectedRoom.hotelId) !== hotelNumber) {
            throw new ValidationException(
                "This room does not belong to the selected hotel."
            );
        }
        displayRoomDetails();
        fillBookingDetails();
    } catch (error) {
        if (bookingMessage) {
            handleError(error, bookingMessage);
        }
    }
}
function displayRoomDetails() {
    if (!roomType) return;
    roomType.textContent =
        `Room Type: ${selectedRoom.roomType}`;
    roomNumber.textContent =
        `Room Number: ${selectedRoom.roomNumber}`;
    roomPrice.textContent =
        `Price: ₹${selectedRoom.price} per night`;
    roomCapacity.textContent =
        `Capacity: ${selectedRoom.capacity} guests`;
}
function fillBookingDetails() {
    if (!checkInInput) return;
    if (selectedCheckIn) {
        checkInInput.value = selectedCheckIn;
    }
    if (selectedCheckOut) {
        checkOutInput.value = selectedCheckOut;
    }
    if (selectedGuests) {
        guestsInput.value = selectedGuests;
    }
    updateCheckOutMinimum();
    calculateTotal();
}
function calculateNights() {
    if (
        !checkInInput ||
        !checkOutInput ||
        !checkInInput.value ||
        !checkOutInput.value
    ) {
        return 0;
    }
    const checkInDate = createDate(checkInInput.value);
    const checkOutDate = createDate(checkOutInput.value);
    const difference = checkOutDate - checkInDate;
    return Math.round(
        difference / (1000 * 60 * 60 * 24)
    );
}
function calculateTotal() {
    if (
        !selectedRoom ||
        !checkInInput.value ||
        !checkOutInput.value
    ) {
        return;
    }
    const nights = calculateNights();
    console.log("Room price:", selectedRoom.price);
    console.log("Check-in:", checkInInput.value);
    console.log("Check-out:", checkOutInput.value);
    console.log("Nights:", nights);
    if (nights <= 0) {
        totalAmount.textContent = "0";
        return;
    }
    const price = Number(selectedRoom.price);
    const total = price * nights;
    console.log("Total:", total);
    totalAmount.textContent = total;
}
if (checkInInput) {
    checkInInput.addEventListener("change", function () {
        updateCheckOutMinimum();
        calculateTotal();
    });
}
if (checkOutInput) {
    checkOutInput.addEventListener("change", calculateTotal);
}
if (bookingForm) {
    bookingForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        try {
            bookingMessage.textContent = "";
            if (!selectedRoom) {
                throw new ValidationException(
                    "Room information is not available."
                );
            }
            if (selectedRoom.status !== "Available") {
                throw new ValidationException(
                    "This room is currently not available."
                );
            }
            const userIdValue =
                document.getElementById("userId").value.trim();
            if (!userIdValue) {
                throw new ValidationException(
                    "Please enter User ID."
                );
            }
            const userId = Number(userIdValue);
            if (!Number.isInteger(userId) || userId <= 0) {
                throw new ValidationException(
                    "User ID must be a valid positive number."
                );
            }
            await getUserById(userId);
            const checkIn = checkInInput.value;
            const checkOut = checkOutInput.value;
            if (!checkIn || !checkOut) {
                throw new ValidationException(
                    "Please select both check-in and check-out dates."
                );
            }
            const checkInDate = createDate(checkIn);
            const checkOutDate = createDate(checkOut);
            if (
                Number.isNaN(checkInDate.getTime()) ||
                Number.isNaN(checkOutDate.getTime())
            ) {
                throw new ValidationException(
                    "Please enter valid dates."
                );
            }
            const today = createDate(getToday());
            if (checkInDate < today) {
                throw new ValidationException(
                    "Check-in date cannot be in the past."
                );
            }
            if (checkOutDate <= checkInDate) {
                throw new ValidationException(
                    "Check-out date must be after check-in date."
                );
            }
            const guestsValue = guestsInput.value.trim();
            if (!guestsValue) {
                throw new ValidationException(
                    "Please enter number of guests."
                );
            }
            const guests = Number(guestsValue);
            if (!Number.isInteger(guests) || guests <= 0) {
                throw new ValidationException(
                    "Guests must be a positive whole number."
                );
            }
            if (guests > Number(selectedRoom.capacity)) {
                throw new ValidationException(
                    `This room can accommodate only ${selectedRoom.capacity} guests.`
                );
            }
            const bookings = await getBookingsByRoom(roomId);
            const overlappingBooking = bookings.find(booking => {
                if (booking.status === "Cancelled") {
                    return false;
                }
                const existingCheckIn =
                    createDate(booking.checkIn);
                const existingCheckOut =
                    createDate(booking.checkOut);
                return (
                    checkInDate < existingCheckOut &&
                    checkOutDate > existingCheckIn
                );
            });
            if (overlappingBooking) {
                if (Number(overlappingBooking.userId) === userId) {
                    throw new ValidationException(
                        "You have already booked this room for the selected dates."
                    );
                }
                throw new ValidationException(
                    "This room is already booked for the selected dates. Please choose different dates or another room."
                );
            }
            const nights = calculateNights();
            const amount =
                Number(selectedRoom.price) * nights;
            const bookingData = {
                userId: userId,
                hotelId: Number(hotelId),
                roomId: Number(roomId),
                checkIn: checkIn,
                checkOut: checkOut,
                guests: guests,
                totalAmount: amount,
                status: "Confirmed",
                bookingDate: getToday()
            };
            const booking =await createBooking(bookingData);
            bookingMessage.textContent =`Booking successful! Booking ID: ${booking.id}`;
            alert(`Booking successful!`);
            totalAmount.textContent = "0";
        } catch (error) {
            handleError(error, bookingMessage);
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    setDateLimits();
    loadRoom();
});
