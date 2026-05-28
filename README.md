
# CafeTales ☕

CafeTales is a modern cafe and restaurant management web application developed using PHP, MySQL, HTML, CSS, and JavaScript. The project provides an interactive platform for customers to explore the cafe menu, make reservations, manage bookings, browse events and offers, and contact the cafe online.

The system also includes an admin panel for managing reservations, customer interactions, and website content.

---

# Features

## Customer Features
- User authentication and login system
- Browse cafe menu and offers
- Table reservation system
- View and manage bookings
- Shopping cart functionality
- Contact form integration
- Event and gallery pages
- Responsive modern UI design

## Admin Features
- Admin dashboard
- Reservation management
- Booking management
- User management
- Contact inquiry handling
- Database connectivity and management

---

# Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript

## Backend
- PHP

## Database
- MySQL

---

# Project Structure

```plaintext
cafetales/
│
├── css/
├── js/
├── images/
├── uploads/
├── database/
│   └── SQL database files
│
├── index.html
├── menu.html
├── reservation.html
├── cart.html
├── login.html
├── admin.html
├── api.php
├── auth_api.php
├── contact_api.php
├── db_connect.php
└── README.md
````

---

# Installation Guide

## Step 1: Clone Repository

```bash
git clone https://github.com/luckywadhwaniya/cafetales.git
```

---

## Step 2: Move Project to XAMPP/WAMP

Place the project folder inside:

### XAMPP

```plaintext
htdocs/
```

### WAMP

```plaintext
www/
```

---

## Step 3: Start Apache and MySQL

Open:

* XAMPP Control Panel
  OR
* WAMP Server

Start:

* Apache
* MySQL

---

## Step 4: Import Database

1. Open phpMyAdmin
2. Create a new database
3. Open the `database/` folder
4. Import the provided `.sql` file

---

## Step 5: Configure Database Connection

Open:

```php
db_connect.php
```

Update credentials:

```php
$host = "localhost";
$user = "root";
$password = "";
$database = "your_database_name";
```

---

## Step 6: Run Project

Open browser:

```plaintext
http://localhost/cafetales
```

---

