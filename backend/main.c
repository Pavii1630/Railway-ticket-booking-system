#include <stdio.h>
#include <string.h>
#include "rail.h"

void readName(char name[]) {
    fgets(name, 50, stdin);
    name[strcspn(name, "\n")] = '\0';
}

int readNumber() {
    int number;
    scanf("%d", &number);

    while (getchar() != '\n');

    return number;
}

int main() {
    int choice, age, seatNo;
    char name[50];

    WaitRequest request;

    initializeSeats();

    printf("=================================\n");
    printf("       RAILEASE RESERVATION      \n");
    printf("=================================\n");

    while (1) {
        printf("\n1. Book Ticket");
        printf("\n2. Cancel Ticket");
        printf("\n3. View Available Seats");
        printf("\n4. View Passengers");
        printf("\n5. View Waiting List");
        printf("\n6. Exit");

        printf("\n\nEnter your choice: ");
        choice = readNumber();

        switch (choice) {

            case 1:
                printf("\nEnter passenger name: ");
                readName(name);

                printf("Enter passenger age: ");
                age = readNumber();

                seatNo = bookSeat();

                if (seatNo == 0) {
                    if (enqueue(name, age)) {
                        printf("\nAll seats are booked.\n");
                        printf("%s added to waiting list.\n", name);
                    } else {
                        printf("\nWaiting list is full.\n");
                    }
                } else {
                    addPassenger(name, age, seatNo);

                    printf("\nTicket booked successfully!\n");
                    printf("Passenger: %s\n", name);
                    printf("Seat Number: %d\n", seatNo);
                }

                break;

            case 2:
                printf("\nEnter seat number to cancel: ");
                seatNo = readNumber();

                if (cancelSeat(seatNo)) {
                    removePassenger(seatNo);

                    printf("\nTicket cancelled successfully!\n");

                    if (dequeue(&request)) {
                        int newSeat = bookSeat();

                        addPassenger(
                            request.name,
                            request.age,
                            newSeat
                        );

                        printf("\nWaiting list passenger confirmed!\n");
                        printf("Passenger: %s\n", request.name);
                        printf("New Seat Number: %d\n", newSeat);
                    }
                } else {
                    printf("\nInvalid seat number or seat is not booked.\n");
                }

                break;

            case 3:
                displaySeats();
                break;

            case 4:
                displayPassengers();
                break;

            case 5:
                displayQueue();
                break;

            case 6:
                printf("\nThank you for using RailEase!\n");
                return 0;

            default:
                printf("\nInvalid choice. Try again.\n");
        }
    }

    return 0;
}