# DhobiDash - Project Documentation

## 🧺 Overview

DhobiDash is a web-based laundry management application that streamlines the process of laundry pickup and delivery for users. The platform allows users to register, book laundry services, track order status, and manage profiles, while the backend ensures secure data handling and service integration.

---

## 📌 Objectives

* Provide a user-friendly interface for laundry booking
* Enable real-time tracking of laundry orders
* Simplify service management for admins
* Ensure secure login and data privacy

---

## 💻 Technology Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* ShadCN UI
* Typewriter Effect

### Backend

* Node.js
* Express.js
* MongoDB
* JWT (Authentication)
* bcrypt (Password Hashing)

---

## 🧭 Features

### For Users

* Signup/Login Authentication
* Book a laundry pickup
* Track order status
* View past orders and profile

### For Admins (optional future scope)

* Manage all bookings
* Update order status
* View user base

---

## 🔧 Folder Structure

```
DhobiDash/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # App pages (Home, Login, Dashboard)
│   │   ├── hooks/          # Custom hooks
│   │   └── App.jsx         # Main app file
│   └── public/
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API routes (auth.js)
│   │   ├── controllers/    # Route logic
│   │   ├── models/         # MongoDB schemas
│   │   └── index.js        # App entry point
│   └── .env                # Environment variables
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nish-09/DhobiDash.git
cd DhobiDash
```

### 2. Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 3. Configure environment variables

In `server/.env`, add:

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret_key
```

### 4. Run the application

```bash
# Backend
cd server && npm run dev

# Frontend
cd ../client && npm run dev
```

---

## 📸 UI Snapshots

*Add UI screenshots or walkthrough GIFs here for better clarity.*

---

## 🔐 Authentication

* Uses JWT tokens stored in local storage
* bcrypt is used for securely hashing passwords

---

## 📈 Future Enhancements

* Admin dashboard
* Order history filtering & sorting
* Payment gateway integration
* Notifications (email/SMS)

---

## 👨‍💻 Developer Info

**Nishit Parikh**
🔗 [LinkedIn](https://www.linkedin.com/in/nishitparikh)
💻 [GitHub](https://github.com/nish-09)

---
