# 🚗 AutoBazaar – Used Vehicle Marketplace

A full-stack Node.js + Express + MongoDB app for listing and buying used vehicles, with appointment/test-drive booking.

---

## Features

- **User Auth** – Register/Login with bcrypt-hashed passwords
- **Vehicle Listings** – Post cars, bikes, trucks, scooters with photos
- **Search & Filter** – Filter by category, keyword, and price range
- **Appointment Booking** – Buyers can request test drives with date/time
- **Seller Dashboard** – Confirm or decline booking requests
- **Buyer Dashboard** – View and cancel bookings

---

## Project Structure

```
marketplace/
├── server.js              ← Entry point
├── middleware/
│   └── auth.js            ← Session-based route protection
├── models/
│   ├── User.js
│   ├── Listing.js
│   └── Appointment.js
├── routes/
│   ├── index.js           ← Home + search
│   ├── auth.js            ← Login/Register/Logout
│   ├── listings.js        ← CRUD for listings
│   └── appointments.js    ← Book/manage appointments
├── views/
│   ├── partials/          ← header.ejs, footer.ejs
│   ├── auth/              ← login.ejs, register.ejs
│   ├── listings/          ← index, show, new, edit, my
│   └── appointments/      ← new, my, incoming
└── public/
    ├── css/style.css
    └── uploads/           ← Image uploads stored here
```

---

## Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Make sure MongoDB is running locally
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu/Linux
sudo systemctl start mongod

# Or use MongoDB Atlas – set MONGO_URI env var
```

### 3. Start the server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

### 4. Open in browser
```
http://localhost:3000
```

---

## Environment Variables (optional)

| Variable    | Default                                  | Description           |
|-------------|------------------------------------------|-----------------------|
| `PORT`      | `3000`                                   | Port to run server on |
| `MONGO_URI` | `mongodb://localhost:27017/marketplace`  | MongoDB connection URI |

---

## User Roles

- **Buyer** – Browse listings, book test drives, manage bookings
- **Seller** – Post listings, manage listings, confirm/decline booking requests

> Note: Both roles can be used by the same account. Role is set at registration.

---

## Tech Stack

| Layer      | Tech                        |
|------------|-----------------------------|
| Server     | Node.js + Express           |
| Database   | MongoDB + Mongoose          |
| Templating | EJS                         |
| Auth       | express-session + bcryptjs  |
| Uploads    | multer (local disk)         |
| Styling    | Custom CSS (dark theme)     |
