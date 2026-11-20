#include <stdio.h>
#include "rail.h"

int seats[MAX_SEATS + 1];

void initializeSeats() {
    for (int i = 1; i <= MAX_SEATS; i++) {
        seats[i] = 0;
    }
}

int bookSeat() {
    for (int i = 1; i <= MAX_SEATS; i++) {
        if (seats[i] == 0) {
            seats[i] = 1;
            return i;
        }
    }

    return 0;
}

int cancelSeat(int seatNo) {
    if (seatNo < 1 || seatNo > MAX_SEATS) {
        return 0;
    }

    if (seats[seatNo] == 0) {
        return 0;
    }

    seats[seatNo] = 0;
    return 1;
}

void displaySeats() {
    printf("\n------ SEAT STATUS ------\n");

    for (int i = 1; i <= MAX_SEATS; i++) {
        if (seats[i] == 0) {
            printf("Seat %d : Available\n", i);
        } else {
            printf("Seat %d : Booked\n", i);
        }
    }
}