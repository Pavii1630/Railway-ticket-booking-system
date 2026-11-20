#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "rail.h"

Passenger *head = NULL;

void addPassenger(char name[], int age, int seatNo) {
    Passenger *newPassenger =
        (Passenger *)malloc(sizeof(Passenger));

    if (newPassenger == NULL) {
        printf("Memory allocation failed.\n");
        return;
    }

    strcpy(newPassenger->name, name);
    newPassenger->age = age;
    newPassenger->seatNo = seatNo;

    newPassenger->next = head;
    head = newPassenger;
}

void removePassenger(int seatNo) {
    Passenger *current = head;
    Passenger *previous = NULL;

    while (current != NULL) {
        if (current->seatNo == seatNo) {

            if (previous == NULL) {
                head = current->next;
            } else {
                previous->next = current->next;
            }

            free(current);
            return;
        }

        previous = current;
        current = current->next;
    }
}

void displayPassengers() {
    Passenger *current = head;

    printf("\n------ CONFIRMED PASSENGERS ------\n");

    if (current == NULL) {
        printf("No confirmed passengers.\n");
        return;
    }

    while (current != NULL) {
        printf("Name: %s | Age: %d | Seat: %d\n",
               current->name,
               current->age,
               current->seatNo);

        current = current->next;
    }
}