# Volunteer Management App - MERN stack

MERN app for volunteers and events tracking

Basic Functionalities Depending on Volunteer and Admin Role:

Anyone(public):

1. Login
2. Register

Both Admin and Volunteer:

1. View all events
2. Sort/Search/Filter events

Admin:

1. Add events and shifts
2. Add (update) shifts to existing events
3. View non-sensitive info of every volunteer
4. Sort volunteers according to options (e.g., volunteered hours in ascending hours)
5. Search volunteers by name

Volunteer:

1. Sign up for a shift (if applicable)
2. Cancel a shift (if applicable)
3. Update your info (e.g., password)

Models: 
+ Event
+ User (both volunteers and administrators)

Types of middleware: 
+ Authentication/Authorization: for certain resources, user need to be logged in to view, and for others, only specific roles can access
+ Custom error handling: when there's an internal server error from the database, etc.
+ Database middleware: for Event model
  - EventShift schema is a nested array of embedded documents inside Event schema
  - EventShift schema contains important properties such as volunteer shift times(i.e., shiftStart, shiftEnd, shiftDuration)
  - Middleware ensures that the correct data structure is being stored every time data gets updated
    
[]architecture diagram for role based routes, jwt auth
