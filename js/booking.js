import {
    getRoomById,
    getBookingsByRoom,
    getUserById,
    createBooking
} from "./services/bookingService.js";

import { ValidationException } from "../exception/validationException.js";
import { handleError } from "../exception/errorHandler.js";

// ELEMENTS

const roomType =
    document.getElementById("roomType");

const roomNumber =
    document.getElementById("roomNumber");

const roomPrice =
    document.getElementById("roomPrice");

const roomCapacity =
    document.getElementById("roomCapacity");

const bookingForm =
    document.getElementById("bookingForm");

const checkInInput =
    document.getElementById("checkIn");

const checkOutInput =
    document.getElementById("checkOut");

const guestsInput =
    document.getElementById("guests");

const totalAmount =
    document.getElementById("totalAmount");

const bookingMessage =
    document.getElementById("bookingMessage");

// URL VALUES

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const hotelId =
    urlParams.get("hotelId");

const roomId =
    urlParams.get("roomId");

const selectedCheckIn =
    urlParams.get("checkIn");

const selectedCheckOut =
    urlParams.get("checkOut");

const selectedGuests =
    urlParams.get("guests");


let selectedRoom = null;

// DATE HELPERS

function getToday() {
    return new Date()
        .toISOString()
        .split("T")[0];
}

function createDate(dateString) {
    return new Date(`${dateString}T00:00:00`);
}

function setDateLimits() {

    checkInInput.min = getToday();
    checkOutInput.min = getToday();
}

function updateCheckOutMinimum() {

    if (!checkInInput.value) {
        checkOutInput.min = getToday();
        return;
    }

    const checkInDate =
        createDate(checkInInput.value);

    checkInDate.setDate(
        checkInDate.getDate() + 1
    );

    checkOutInput.min =
        checkInDate.toISOString().split("T")[0];
}

// LOAD ROOM

async function loadRoom() {

    try {

        if (!hotelId || !roomId) {

            throw new ValidationException(
                "Hotel or room information is missing."
            );
        }

        const hotelNumber =
            Number(hotelId);

        const roomNumberValue =
            Number(roomId);

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

        selectedRoom =
            await getRoomById(roomId);


        if (
            Number(selectedRoom.hotelId) !==
            hotelNumber
        ) {

            throw new ValidationException(
                "This room does not belong to the selected hotel."
            );
        }

        displayRoomDetails();

        fillBookingDetails();

    } catch (error) {

        handleError(
            error,
            bookingMessage
        );
    }
}

// DISPLAY ROOM

function displayRoomDetails() {

    roomType.textContent =
        `Room Type: ${selectedRoom.roomType}`;

    roomNumber.textContent =
        `Room Number: ${selectedRoom.roomNumber}`;

    roomPrice.textContent =
        `Price: ₹${selectedRoom.price} per night`;

    roomCapacity.textContent =
        `Capacity: ${selectedRoom.capacity} guests`;
}

// FILL FILTER VALUES

function fillBookingDetails() {

    if (selectedCheckIn) {
        checkInInput.value =
            selectedCheckIn;
    }

    if (selectedCheckOut) {
        checkOutInput.value =
            selectedCheckOut;
    }

    if (selectedGuests) {
        guestsInput.value =
            selectedGuests;
    }

    // IMPORTANT:
    // Update checkout minimum after
    // receiving check-in from URL
    updateCheckOutMinimum();

    calculateTotal();
}

// CALCULATE NIGHTS

function calculateNights() {

    if (
        !checkInInput.value ||
        !checkOutInput.value
    ) {
        return 0;
    }

    const checkInDate =
        createDate(checkInInput.value);

    const checkOutDate =
        createDate(checkOutInput.value);

    const difference =
        checkOutDate - checkInDate;

    return Math.round(
        difference /
        (1000 * 60 * 60 * 24)
    );
}

// CALCULATE TOTAL

function calculateTotal() {

    if (!selectedRoom) {
        return;
    }

    const nights =
        calculateNights();

    if (nights <= 0) {

        totalAmount.textContent = "0";
        return;
    }

    const total =
        Number(selectedRoom.price) *
        nights;

    totalAmount.textContent =
        total;
}

// DATE EVENTS

checkInInput.addEventListener(
    "change",
    function () {

        updateCheckOutMinimum();
        calculateTotal();
    }
);

checkOutInput.addEventListener(
    "change",
    calculateTotal
);

// BOOKING

bookingForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        try {

            bookingMessage.textContent = "";


            // ROOM
            if (!selectedRoom) {

                throw new ValidationException(
                    "Room information is not available."
                );
            }


            // ROOM STATUS
            if (selectedRoom.status !== "Available") {

                throw new ValidationException(
                    "This room is currently not available."
                );
            }


            // USER
            const userIdValue =
                document
                    .getElementById("userId")
                    .value
                    .trim();

            if (!userIdValue) {

                throw new ValidationException(
                    "Please enter User ID."
                );
            }

            const userId =
                Number(userIdValue);

            if (
                !Number.isInteger(userId) ||
                userId <= 0
            ) {

                throw new ValidationException(
                    "User ID must be a valid positive number."
                );
            }

            await getUserById(userId);


            // DATES
            const checkIn =
                checkInInput.value;

            const checkOut =
                checkOutInput.value;

            if (!checkIn || !checkOut) {

                throw new ValidationException(
                    "Please select both check-in and check-out dates."
                );
            }

            const checkInDate =
                createDate(checkIn);

            const checkOutDate =
                createDate(checkOut);

            if (
                Number.isNaN(checkInDate.getTime()) ||
                Number.isNaN(checkOutDate.getTime())
            ) {

                throw new ValidationException(
                    "Please enter valid dates."
                );
            }


            // CHECK-IN CANNOT BE PAST
            const today =
                createDate(getToday());

            if (checkInDate < today) {

                throw new ValidationException(
                    "Check-in date cannot be in the past."
                );
            }


            // CHECK-OUT AFTER CHECK-IN
            if (checkOutDate <= checkInDate) {

                throw new ValidationException(
                    "Check-out date must be after check-in date."
                );
            }


            // GUESTS
            const guestsValue =
                guestsInput.value.trim();

            if (!guestsValue) {

                throw new ValidationException(
                    "Please enter number of guests."
                );
            }

            const guests =
                Number(guestsValue);

            if (
                !Number.isInteger(guests) ||
                guests <= 0
            ) {

                throw new ValidationException(
                    "Guests must be a positive whole number."
                );
            }


            // CAPACITY
            if (
                guests >
                Number(selectedRoom.capacity)
            ) {

                throw new ValidationException(
                    `This room can accommodate only ${selectedRoom.capacity} guests.`
                );
            }


            // EXISTING BOOKINGS
            const bookings =
                await getBookingsByRoom(roomId);


            const overlappingBooking =
                bookings.find(booking => {

                    if (
                        booking.status ===
                        "Cancelled"
                    ) {
                        return false;
                    }

                    const existingCheckIn =
                        createDate(
                            booking.checkIn
                        );

                    const existingCheckOut =
                        createDate(
                            booking.checkOut
                        );

                    return (
                        checkInDate <
                        existingCheckOut &&
                        checkOutDate >
                        existingCheckIn
                    );
                });


            if (overlappingBooking) {

                if (
                    Number(
                        overlappingBooking.userId
                    ) === userId
                ) {

                    throw new ValidationException(
                        "You have already booked this room for the selected dates."
                    );
                }

                throw new ValidationException(
                    "This room is already booked for the selected dates. Please choose different dates or another room."
                );
            }


            // TOTAL
            const nights =
                calculateNights();

            const amount =
                Number(selectedRoom.price) *
                nights;


            // BOOKING DATA
            const bookingData = {

                userId: userId,

                hotelId:
                    Number(hotelId),

                roomId:
                    Number(roomId),

                checkIn: checkIn,

                checkOut: checkOut,

                guests: guests,

                totalAmount: amount,

                status: "Confirmed",

                bookingDate:
                    getToday()
            };


            // CREATE BOOKING
            const booking =
                await createBooking(
                    bookingData
                );


            // SUCCESS
            bookingMessage.textContent =
                `Booking successful! Booking ID: ${booking.id}`;

            bookingForm.reset();

            totalAmount.textContent = "0";

        } catch (error) {

            handleError(
                error,
                bookingMessage
            );
        }
    }
);

setDateLimits();
loadRoom();