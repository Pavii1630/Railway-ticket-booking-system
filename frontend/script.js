
// ======================================
// RAILEASE - TRAIN RESERVATION WEBSITE
// ======================================

// SAMPLE TRAIN DATA

const trains = [
    {
        id: 1,
        name: "Brindavan Express",
        number: "12639",
        from: "Bengaluru",
        to: "Chennai",
        departure: "07:40 AM",
        arrival: "01:15 PM",
        duration: "5h 35m",
        price: 450,
        seats: 40
    },
    {
        id: 2,
        name: "Shatabdi Express",
        number: "12028",
        from: "Bengaluru",
        to: "Chennai",
        departure: "06:00 AM",
        arrival: "11:00 AM",
        duration: "5h",
        price: 750,
        seats: 35
    },
    {
        id: 3,
        name: "Chennai Mail",
        number: "12658",
        from: "Bengaluru",
        to: "Chennai",
        departure: "10:30 PM",
        arrival: "05:45 AM",
        duration: "7h 15m",
        price: 380,
        seats: 30
    },
    {
        id: 4,
        name: "Kacheguda Express",
        number: "17604",
        from: "Bengaluru",
        to: "Hyderabad",
        departure: "09:00 PM",
        arrival: "07:30 AM",
        duration: "10h 30m",
        price: 520,
        seats: 45
    },
    {
        id: 5,
        name: "Duronto Express",
        number: "12213",
        from: "Bengaluru",
        to: "Mumbai",
        departure: "11:00 AM",
        arrival: "05:30 AM",
        duration: "18h 30m",
        price: 950,
        seats: 50
    },
    {
        id: 6,
        name: "Udyan Express",
        number: "11302",
        from: "Bengaluru",
        to: "Mumbai",
        departure: "08:00 PM",
        arrival: "04:00 PM",
        duration: "20h",
        price: 680,
        seats: 40
    }
];

// APPLICATION VARIABLES

let selectedTrain = null;
let selectedSeats = [];
let selectedClass = "Sleeper";
let currentSearchDate = "";

let bookings = JSON.parse(localStorage.getItem("railEaseBookings")) || [];

const classPrices = {
    "Sleeper": 1,
    "3AC": 1.6,
    "2AC": 2.2,
    "1AC": 3
};

// ======================================
// PAGE NAVIGATION
// ======================================

function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageName).classList.add("active");

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
    });

    const activeLink = document.querySelector(
        `.nav-link[data-page="${pageName}"]`
    );

    if (activeLink) {
        activeLink.classList.add("active");
    }

    const titles = {
        dashboard: ["Dashboard", "Your journey starts here."],
        search: ["Search Trains", "Find the perfect train for your journey."],
        bookings: ["My Bookings", "Manage all your train reservations."]
    };

    document.getElementById("page-title").textContent = titles[pageName][0];
    document.getElementById("page-subtitle").textContent = titles[pageName][1];

    if (pageName === "bookings") {
        displayBookings();
    }

    if (pageName === "dashboard") {
        updateDashboard();
    }

    window.scrollTo(0, 0);
}

document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        showPage(this.dataset.page);

    });

});

// ======================================
// DATE SETTINGS
// ======================================

const today = new Date();

const dateText = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
});

document.getElementById("today-date").textContent = dateText;

const formattedDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

document.querySelectorAll('input[type="date"]').forEach(input => {
    input.min = formattedDate;
    input.value = formattedDate;
});

// ======================================
// ROUTE SELECTION
// ======================================

function selectRoute(from, to) {

    document.getElementById("search-from").value = from;
    document.getElementById("search-to").value = to;

    document.getElementById("search-date").value = formattedDate;

    showPage("search");

    searchTrains(from, to, formattedDate);
}

// ======================================
// TRAIN SEARCH
// ======================================

document.getElementById("quick-search-form")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const from = document.getElementById("quick-from").value;
    const to = document.getElementById("quick-to").value;
    const date = document.getElementById("quick-date").value;

    document.getElementById("search-from").value = from;
    document.getElementById("search-to").value = to;
    document.getElementById("search-date").value = date;

    showPage("search");

    searchTrains(from, to, date);

});

document.getElementById("train-search-form")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const from = document.getElementById("search-from").value;
    const to = document.getElementById("search-to").value;
    const date = document.getElementById("search-date").value;

    searchTrains(from, to, date);

});

function searchTrains(from, to, date) {

    const results = trains.filter(train => {

        return train.from.toLowerCase() === from.trim().toLowerCase() &&
               train.to.toLowerCase() === to.trim().toLowerCase();

    });

    selectedClass = document.getElementById("search-class").value;
    currentSearchDate = date;

    displayTrains(results);

}

// ======================================
// DISPLAY TRAIN RESULTS
// ======================================

function getBookedSeats(trainId, journeyDate) {

    let booked = [];

    bookings.forEach(booking => {

        if (
            booking.trainId === trainId &&
            booking.date === journeyDate &&
            booking.status === "Confirmed"
        ) {
            booked = booked.concat(booking.seats);
        }

    });

    return booked;

}

function displayTrains(results) {

    const container = document.getElementById("train-results");

    document.getElementById("results-count").textContent =
        results.length + " Trains";

    document.getElementById("results-description").textContent =
        "Showing trains for " + currentSearchDate;

    if (results.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="train-front"></i>
                <h3>No trains found</h3>
                <p>Try another route or destination.</p>
            </div>
        `;

        refreshIcons();
        return;
    }

    container.innerHTML = "";

    results.forEach(train => {

        const booked = getBookedSeats(train.id, currentSearchDate);
        const available = train.seats - booked.length;

        const price = Math.round(
            train.price * classPrices[selectedClass]
        );

        const card = document.createElement("div");

        card.className = "train-card";

        card.innerHTML = `
            <div class="train-top">
                <div>
                    <div class="train-name">${train.name}</div>
                    <div class="train-number">Train No: ${train.number}</div>
                </div>
                <span class="train-class">${selectedClass}</span>
            </div>

            <div class="train-route">
                <div class="station-time">
                    <h3>${train.departure}</h3>
                    <p>${train.from}</p>
                </div>

                <div class="route-line">
                    ${train.duration}
                    <div></div>
                    Direct
                </div>

                <div class="station-time" style="text-align:right">
                    <h3>${train.arrival}</h3>
                    <p>${train.to}</p>
                </div>
            </div>

            <div class="train-bottom">
                <div>
                    <div class="seat-status">
                        ${available} Seats Available
                    </div>
                    <div class="train-price">
                        ₹${price}
                        <small>/ person</small>
                    </div>
                </div>

                <button class="book-button" ${available === 0 ? "disabled" : ""}>
                    ${available === 0 ? "Sold Out" : "Book Now"}
                </button>
            </div>
        `;

        const bookButton = card.querySelector(".book-button");

        bookButton.addEventListener("click", () => {
            openBooking(train);
        });

        container.appendChild(card);

    });

    refreshIcons();

}

// ======================================
// BOOKING MODAL
// ======================================

function openBooking(train) {

    selectedTrain = train;
    selectedSeats = [];

    selectedClass = document.getElementById("search-class").value;

    document.getElementById("selected-train-info").innerHTML = `
        <div class="selected-train-box">
            <strong>${train.name} (${train.number})</strong>
            <p>${train.from} → ${train.to}</p>
            <p>${train.departure} - ${train.arrival}</p>
            <p>Class: ${selectedClass}</p>
        </div>
    `;

    document.getElementById("passenger-fields").innerHTML = `
        <div class="passenger-input-group">
            <div class="form-field">
                <label>Full Name</label>
                <input type="text" name="name" placeholder="Enter passenger name" required>
            </div>

            <div class="form-row">
                <div class="form-field">
                    <label>Age</label>
                    <input type="number" name="age" min="1" max="120" placeholder="Age" required>
                </div>

                <div class="form-field">
                    <label>Gender</label>
                    <select name="gender" required>
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
            </div>
        </div>
    `;

    displaySeats();

    updatePrice();

    document.getElementById("booking-modal").classList.add("show");

    refreshIcons();

}

function closeModal() {

    document.getElementById("booking-modal").classList.remove("show");

}

// ======================================
// ADD PASSENGERS
// ======================================

function addPassengerField() {

    const container = document.getElementById("passenger-fields");

    const group = document.createElement("div");

    group.className = "passenger-input-group";

    group.innerHTML = `
        <div class="form-field">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="Enter passenger name" required>
        </div>

        <div class="form-row">
            <div class="form-field">
                <label>Age</label>
                <input type="number" name="age" min="1" max="120" placeholder="Age" required>
            </div>

            <div class="form-field">
                <label>Gender</label>
                <select name="gender" required>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                </select>
            </div>
        </div>
    `;

    container.appendChild(group);

    updatePrice();

}

// ======================================
// SEAT SELECTION
// ======================================

function displaySeats() {

    const grid = document.getElementById("seat-grid");

    const booked = getBookedSeats(selectedTrain.id, currentSearchDate);

    grid.innerHTML = "";

    for (let i = 1; i <= selectedTrain.seats; i++) {

        const seat = document.createElement("button");

        seat.type = "button";
        seat.className = "seat";
        seat.textContent = i;

        if (booked.includes(i)) {

            seat.classList.add("booked");
            seat.disabled = true;

        }

        if (selectedSeats.includes(i)) {
            seat.classList.add("selected");
        }

        seat.addEventListener("click", () => {

            if (selectedSeats.includes(i)) {

                selectedSeats = selectedSeats.filter(
                    seatNumber => seatNumber !== i
                );

            } else {

                const passengerCount = document.querySelectorAll(
                    '#passenger-fields .passenger-input-group'
                ).length;

                if (selectedSeats.length >= passengerCount) {
                    alert("You can select only one seat per passenger.");
                    return;
                }

                selectedSeats.push(i);

            }

            displaySeats();
            updatePrice();

        });

        grid.appendChild(seat);

    }

}

function updatePrice() {

    if (!selectedTrain) return;

    const passengerCount = document.querySelectorAll(
        '#passenger-fields .passenger-input-group'
    ).length;

    const price = Math.round(
        selectedTrain.price * classPrices[selectedClass]
    );

    const total = price * passengerCount;

    document.getElementById("total-price").textContent =
        "₹" + total.toLocaleString("en-IN");

}

// ======================================
// CONFIRM BOOKING
// ======================================

document.getElementById("passenger-form")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const passengerGroups = document.querySelectorAll(
        "#passenger-fields .passenger-input-group"
    );

    if (selectedSeats.length !== passengerGroups.length) {

        alert("Please select one seat for every passenger.");
        return;

    }

    const bookedSeats = getBookedSeats(
        selectedTrain.id,
        currentSearchDate
    );

    const seatsStillAvailable = selectedSeats.every(
        seat => !bookedSeats.includes(seat)
    );

    if (!seatsStillAvailable) {

        alert("One of the selected seats is no longer available. Please select again.");
        displaySeats();
        return;

    }

    const passengers = [];

    passengerGroups.forEach((group, index) => {

        passengers.push({

            id: Date.now() + index,
            name: group.querySelector('[name="name"]').value,
            age: group.querySelector('[name="age"]').value,
            gender: group.querySelector('[name="gender"]').value,
            seat: selectedSeats[index]

        });

    });

    const price = Math.round(
        selectedTrain.price * classPrices[selectedClass]
    );

    const booking = {

        bookingId: "BK" + Date.now(),
        pnr: Math.floor(1000000000 + Math.random() * 9000000000),

        trainId: selectedTrain.id,
        trainName: selectedTrain.name,
        trainNumber: selectedTrain.number,

        from: selectedTrain.from,
        to: selectedTrain.to,

        date: currentSearchDate,
        departure: selectedTrain.departure,
        arrival: selectedTrain.arrival,

        travelClass: selectedClass,

        passengers: passengers,
        seats: selectedSeats,

        total: price * passengers.length,
        status: "Confirmed"

    };

    bookings.push(booking);

    saveBookings();

    closeModal();

    showTicket(booking);

    updateDashboard();

    displayTrains([selectedTrain]);

});

// ======================================
// SAVE BOOKINGS
// ======================================

function saveBookings() {

    localStorage.setItem(
        "railEaseBookings",
        JSON.stringify(bookings)
    );

}

// ======================================
// DISPLAY CONFIRMATION TICKET
// ======================================

function showTicket(booking) {

    const details = document.getElementById("ticket-details");

    let passengerHTML = "";

    booking.passengers.forEach(passenger => {

        passengerHTML += `
            <p>
                <strong>${passenger.name}</strong>
                - Age: ${passenger.age}
                - Seat: ${passenger.seat}
            </p>
        `;

    });

    details.innerHTML = `
        <div class="ticket-design">

            <h3>RAILEASE <span style="color:#4779ed">E-TICKET</span></h3>

            <p>PNR Number: <strong>${booking.pnr}</strong></p>
            <p>Booking ID: <strong>${booking.bookingId}</strong></p>

            <hr style="border:0;border-top:1px dashed #ccd6e9;margin:15px 0">

            <p>Train: <strong>${booking.trainName}</strong></p>
            <p>Train Number: <strong>${booking.trainNumber}</strong></p>
            <p>Journey: <strong>${booking.from} → ${booking.to}</strong></p>
            <p>Date: <strong>${booking.date}</strong></p>
            <p>Departure: <strong>${booking.departure}</strong></p>
            <p>Arrival: <strong>${booking.arrival}</strong></p>
            <p>Class: <strong>${booking.travelClass}</strong></p>

            <hr style="border:0;border-top:1px dashed #ccd6e9;margin:15px 0">

            <p><strong>Passenger Information</strong></p>

            ${passengerHTML}

            <p style="margin-top:15px">
                Total Fare: <strong>₹${booking.total}</strong>
            </p>

            <p>Status: <strong style="color:#20b889">CONFIRMED</strong></p>

        </div>
    `;

    document.getElementById("ticket-modal").classList.add("show");

    refreshIcons();

}

function closeTicket() {

    document.getElementById("ticket-modal").classList.remove("show");

}

// ======================================
// DISPLAY ALL BOOKINGS
// ======================================

function displayBookings() {

    const container = document.getElementById("all-bookings");

    document.getElementById("booking-total").textContent =
        bookings.length;

    if (bookings.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="ticket"></i>
                <h3>No bookings found</h3>
                <p>Book your first train journey to see it here.</p>
                <button class="primary-button" onclick="showPage('search')">
                    Search Trains
                </button>
            </div>
        `;

        refreshIcons();
        return;

    }

    container.innerHTML = "";

    [...bookings].reverse().forEach(booking => {

        const card = document.createElement("div");

        card.className = "booking-card";

        const actionButton = booking.status === "Confirmed"
            ? `
                <button onclick="viewTicket('${booking.bookingId}')">
                    View Ticket
                </button>
                <button class="cancel-button" onclick="cancelBooking('${booking.bookingId}')">
                    Cancel Ticket
                </button>
            `
            : `<span style="color:#e16a6a;font-size:11px;font-weight:700">Cancelled</span>`;

        card.innerHTML = `
            <div class="booking-card-header">
                <span class="pnr-text">PNR: ${booking.pnr}</span>

                <span class="${booking.status === "Confirmed" ? "status-confirmed" : ""}"
                    style="${booking.status === "Cancelled" ? "color:#e16a6a" : ""}">
                    ${booking.status}
                </span>
            </div>

            <h3>${booking.trainName}</h3>

            <div class="booking-details">
                <span>${booking.from} → ${booking.to}</span>
                <span>${booking.date}</span>
                <span>${booking.passengers.length} Passenger(s)</span>
                <span>${booking.travelClass}</span>
                <span>₹${booking.total}</span>
            </div>

            <div class="booking-actions">
                ${actionButton}
            </div>
        `;

        container.appendChild(card);

    });

    refreshIcons();

}

// ======================================
// RECENT BOOKINGS
// ======================================

function displayRecentBookings() {

    const container = document.getElementById("recent-bookings");

    const recent = bookings
        .filter(booking => booking.status === "Confirmed")
        .slice(-2)
        .reverse();

    if (recent.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="ticket"></i>
                <h3>No bookings yet</h3>
                <p>Your booked tickets will appear here.</p>
            </div>
        `;

        refreshIcons();
        return;

    }

    container.innerHTML = "";

    recent.forEach(booking => {

        const item = document.createElement("div");

        item.className = "booking-card";

        item.innerHTML = `
            <div class="booking-card-header">
                <strong>${booking.trainName}</strong>
                <span class="status-confirmed">Confirmed</span>
            </div>

            <div class="booking-details">
                <span>${booking.from} → ${booking.to}</span>
                <span>${booking.date}</span>
                <span>PNR: ${booking.pnr}</span>
            </div>
        `;

        container.appendChild(item);

    });

}

// ======================================
// VIEW TICKET
// ======================================

function viewTicket(bookingId) {

    const booking = bookings.find(
        item => item.bookingId === bookingId
    );

    if (booking) {
        showTicket(booking);
    }

}

// ======================================
// CANCEL BOOKING
// ======================================

function cancelBooking(bookingId) {

    const confirmCancel = confirm(
        "Are you sure you want to cancel this ticket?"
    );

    if (!confirmCancel) return;

    const booking = bookings.find(
        item => item.bookingId === bookingId
    );

    if (booking) {

        booking.status = "Cancelled";

        saveBookings();

        displayBookings();
        updateDashboard();

        if (selectedTrain) {
            displayTrains([selectedTrain]);
        }

        alert("Ticket cancelled successfully.");

    }

}

// ======================================
// DASHBOARD STATISTICS
// ======================================

function updateDashboard() {

    const confirmed = bookings.filter(
        booking => booking.status === "Confirmed"
    );

    document.getElementById("total-bookings").textContent =
        bookings.length;

    document.getElementById("confirmed-bookings").textContent =
        confirmed.length;

    displayRecentBookings();

}

// ======================================
// REFRESH ICONS
// ======================================

function refreshIcons() {

    if (window.lucide) {
        lucide.createIcons();
    }

}

// ======================================
// INITIALIZE WEBSITE
// ======================================

updateDashboard();

displayBookings();

refreshIcons();
