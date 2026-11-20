#ifndef RAIL_H
#define RAIL_H

#define MAX_SEATS 10
#define MAX_WAITLIST 50

typedef struct Passenger {
    char name[50];
    int age;
    int seatNo;
    struct Passenger *next;
} Passenger;

typedef struct WaitRequest {
    char name[50];
    int age;
} WaitRequest;

/* seats.c */
void initializeSeats();
int bookSeat();
int cancelSeat(int seatNo);
void displaySeats();

/* queue.c */
int enqueue(char name[], int age);
int dequeue(WaitRequest *request);
void displayQueue();

/* passengers.c */
void addPassenger(char name[], int age, int seatNo);
void removePassenger(int seatNo);
void displayPassengers();

#endif