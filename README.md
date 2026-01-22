# Simple Banking System

### Project Documentation

### Project Overview

This project is about a Simple Banking System. This project has two main
parts are following:
1) Backend
2) Frontend

### Basic Features developed

```
1) Role based user management.
2) Customer management.
3) Account Management.
4) Transaction management.
5) Separate “DEPOSIT”, “WITHDRAWAL”, “ACCOUNT_TRANSFER” operations
developed.
6) Searching transaction history.
7) Download Account statements
8) Debit/Credit color Indicator.
9) LoggedIn user profile view.
10) Unique Account Number generation.
11) Validation messages.
```
### Technologies are used in the project.

I used several technologies in this project to develop.
**Backend:** Java, Spring Boot-4.0.0, Maven.
**Frontend:** Angular 19.2.19 , NodeJS 18
**Database:** Oracle Database

### Backend project setup

Please clone the project from the repository:
https://github.com/gitsayed/simple-banking-system
1) Now check that your oracle database is installed in your machine and is running.


2) Create a database with your desired name.
3) Go to the project “backend” folder and it is the backend project.
4) There you find a file **applications.properties** file in this location
**/backend/src/main/resources/applications.properties**
5) Change the following properties with database information:
**a) spring.datasource.url=jdbc:oracle:thin:@localhost:1521/TEST_BANK
b) spring.datasource.username=appuser
c) spring.datasource.password=appuser**
6) Set your “ **server.port=** ” property with your port.
7) Please execute SQL commands in your database which stored in the following
location **/backend/src/main/resources/DB_FILES/InitialScript.sql**
8) Now you need JDK and Maven in your machine. I used JDK 25 in this backend
project.
9) When installed JDK and Maven, later run the following commands one after one:
a) mvn clean package -DskipTests
b) mvn spring-boot:run
9) Now you will see that the project will start with the desired port and machine IP
Address.
10) Now you can test the APIs from these url:
[http://localhost:8080/cbs/swagger-ui/index.html](http://localhost:8080/cbs/swagger-ui/index.html)

### Frontend project setup

Please clone the project from the repository:
https://github.com/gitsayed/simple-banking-system
1) Please see the frontend project in the cloned location frontend folder.
2) I used Node Js 18 and Angular 19.2.19 to develop the frontend project. So,
please install those in your machine.
3) Please configure environment.ts file file to connect your backend project with
frontend project.
4) Now run following commands:
a) “npm install”
b) “ng serve”
5) The Angular project opens on [http://localhost:4200](http://localhost:4200) port by default. You can test
the project right now.
6) A default user stored in the SQL file in the backend project. Which
a) Username: “admin”,
b) Password: “admin”,
c) Roles: [ADMIN]


### Conclusion:

This is my project. It is the initial stage of this project. Later, new feature and development will be done.

## Thank you all.


