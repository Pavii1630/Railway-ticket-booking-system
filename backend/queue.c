#include <stdio.h>
#include <string.h>
#include "rail.h"

WaitRequest waitingList[MAX_WAITLIST];

int front = 0;
int rear = -1;

int enqueue(char name[], int age) {
    if (rear == MAX_WAITLIST - 1) {
        return 0;
    }

    rear++;

    strcpy(waitingList[rear].name, name);
    waitingList[rear].age = age;

    return 1;
}

int dequeue(WaitRequest *request) {
    if (front > rear) {
        return 0;
    }

    *request = waitingList[front];
    front++;

    if (front > rear) {
        front = 0;
        rear = -1;
    }

    return 1;
}

void displayQueue() {
    printf("\n------ WAITING LIST ------\n");

    if (front > rear) {
        printf("No passengers in waiting list.\n");
        return;
    }

    for (int i = front; i <= rear; i++) {
        printf("%d. %s (Age: %d)\n",
               i - front + 1,
               waitingList[i].name,
               waitingList[i].age);
    }
}