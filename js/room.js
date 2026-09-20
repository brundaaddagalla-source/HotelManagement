import { getRoomsByHotel } from "./services/roomService.js";
import { getBookingsByRoom } from "./services/bookingService.js";
import { handleError } from "../exception/errorHandler.js";

const roomContainer = document.getElementById("roomContainer");
const roomMessage = document.getElementById("roomMessage");

const statusFilter = document.getElementById("statusFilter");
const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");
const guestsInput = document.getElementById("guests");

const applyFilterBtn = document.getElementById("applyFilterBtn");
const clearFilterBtn = document.getElementById("clearFilterBtn");

// HOTEL ID

const urlParams = new URLSearchParams(
    window.location.search
);

const hotelId = urlParams.get("hotelId");

let allRooms = [];

// DATE LIMITS

function getToday() {
    return new Date().toISOString().split("T")[0];
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
        new Date(`${checkInInput.value}T00:00:00`);

    checkInDate.setDate(
        checkInDate.getDate() + 1
    );

    checkOutInput.min =
        checkInDate.toISOString().split("T")[0];

    if (
        checkOutInput.value &&
        checkOutInput.value < checkOutInput.min
    ) {
        checkOutInput.value = "";
    }
}

// LOAD ROOMS

async function loadRooms() {

    if (!hotelId) {
        roomMessage.textContent =
            "Hotel information is missing.";
        return;
    }

    try {

        allRooms =
            await getRoomsByHotel(hotelId);

        // Show all rooms initially
        displayRooms(allRooms);

    } catch (error) {

        handleError(error, roomMessage);
    }
}

// DISPLAY ROOMS

function displayRooms(rooms) {

    roomContainer.innerHTML = "";
    roomMessage.textContent = "";

    if (rooms.length === 0) {

        roomMessage.textContent =
            "No rooms match your filter.";

        return;
    }

    rooms.forEach(room => {

        const roomCard =
            document.createElement("div");

        roomCard.className = "room-card";

        roomCard.innerHTML = `
            <h3>${room.roomType} Room</h3>

            <p>
                <strong>Room Number:</strong>
                ${room.roomNumber}
            </p>

            <p>
                <strong>Price:</strong>
                ₹${room.price} per night
            </p>

            <p>
                <strong>Capacity:</strong>
                ${room.capacity} guests
            </p>

            <p>
                <strong>Status:</strong>
                ${room.status}
            </p>

            ${
                room.status === "Available"
                ?
                `<button
                    class="select-room-btn"
                    data-room-id="${room.id}">
                    Select Room
                </button>`
                :
                `<button disabled>
                    Not Available
                </button>`
            }
        `;

        roomContainer.appendChild(roomCard);
    });

    addRoomButtonEvents();
}

// SELECT ROOM

function addRoomButtonEvents() {

    const buttons =
        document.querySelectorAll(".select-room-btn");

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const roomId =
                    this.dataset.roomId;

                const checkIn =
                    checkInInput.value;

                const checkOut =
                    checkOutInput.value;

                const guests =
                    guestsInput.value;

                const params = new URLSearchParams();

                params.set("hotelId", hotelId);
                params.set("roomId", roomId);

                if (checkIn && checkOut) {

                    params.set("checkIn", checkIn);
                    params.set("checkOut", checkOut);
                }

                if (guests) {

                    params.set("guests", guests);
                }

                window.location.href =
                    `booking.html?${params.toString()}`;
            }
        );
    });
}

// CHECK DATE OVERLAP

function hasDateOverlap(
    checkIn,
    checkOut,
    bookings
) {

    const newCheckIn =
        new Date(`${checkIn}T00:00:00`);

    const newCheckOut =
        new Date(`${checkOut}T00:00:00`);

    return bookings.some(booking => {

        if (booking.status === "Cancelled") {
            return false;
        }

        const existingCheckIn =
            new Date(`${booking.checkIn}T00:00:00`);

        const existingCheckOut =
            new Date(`${booking.checkOut}T00:00:00`);

        return (
            newCheckIn < existingCheckOut &&
            newCheckOut > existingCheckIn
        );
    });
}

//APPLY FILTER

applyFilterBtn.addEventListener(
    "click",
    async function () {

        try {

            roomMessage.textContent =
                "Checking room availability...";

            let filteredRooms =
                [...allRooms];


            // STATUS FILTER
            if (statusFilter.value !== "All") {

                filteredRooms =
                    filteredRooms.filter(
                        room =>
                            room.status === statusFilter.value
                    );
            }


            // GUEST FILTER
            const guestsValue =
                guestsInput.value.trim();

            if (guestsValue) {

                const guests =
                    Number(guestsValue);

                if (
                    !Number.isInteger(guests) ||
                    guests <= 0
                ) {

                    roomMessage.textContent =
                        "Please enter a valid number of guests.";

                    return;
                }

                filteredRooms =
                    filteredRooms.filter(
                        room =>
                            Number(room.capacity) >= guests
                    );
            }


            // DATE FILTER
            const checkIn =
                checkInInput.value;

            const checkOut =
                checkOutInput.value;

            if (
                (checkIn && !checkOut) ||
                (!checkIn && checkOut)
            ) {

                roomMessage.textContent =
                    "Please select both check-in and check-out dates.";

                return;
            }


            if (checkIn && checkOut) {

                const checkInDate =
                    new Date(`${checkIn}T00:00:00`);

                const checkOutDate =
                    new Date(`${checkOut}T00:00:00`);

                if (checkOutDate <= checkInDate) {

                    roomMessage.textContent =
                        "Check-out date must be after check-in date.";

                    return;
                }


                const availableRooms = [];

                for (const room of filteredRooms) {

                    if (room.status !== "Available") {
                        continue;
                    }

                    const bookings =
                        await getBookingsByRoom(room.id);

                    if (
                        !hasDateOverlap(
                            checkIn,
                            checkOut,
                            bookings
                        )
                    ) {

                        availableRooms.push(room);
                    }
                }

                filteredRooms =
                    availableRooms;
            }


            displayRooms(filteredRooms);

        } catch (error) {

            handleError(
                error,
                roomMessage
            );
        }
    }
);

// CLEAR FILTER

clearFilterBtn.addEventListener(
    "click",
    function () {

        statusFilter.value = "All";
        checkInInput.value = "";
        checkOutInput.value = "";
        guestsInput.value = "";

        setDateLimits();

        displayRooms(allRooms);
    }
);

// DATE EVENTS

checkInInput.addEventListener(
    "change",
    updateCheckOutMinimum
);

setDateLimits();
loadRooms();