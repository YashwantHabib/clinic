# Appointment Booking Application

This is a full-stack appointment booking application for a small clinic, built as a take-home project. It allows patients to register, log in, view available slots, book appointments, and see their own bookings. An admin user can log in and view all bookings.

## Live Application URLs

* **Frontend URL**: [https://clinic-frontend-six.vercel.app](https://clinic-frontend-six.vercel.app)
* **API URL**: [https://clinic-backend-ik2b.onrender.com](https://clinic-backend-ik2b.onrender.com)

## Test Credentials

* **Patient**: `patient@example.com` / `Passw0rd!`
* **Admin**: `admin@example.com` / `Passw0rd!`

## Public Git Repository

* **Repo URL Backend**: [https://github.com/YashwantHabib/clinic-backend](https://github.com/YashwantHabib/clinic-backend)
* * **Repo URL Frontend**: [https://github.com/YashwantHabib/clinic-frontend](https://github.com/YashwantHabib/clinic-frontend)

---

## Tech Stack Choices

### Backend
* **Language**: **TypeScript** - For type safety and better code quality.
* **Framework**: **Express.js** - A minimalist and flexible web framework for Node.js.
* **Authentication**: **JWT (JSON Web Tokens)** - For stateless authentication and role-based access.
* **Database**: **PostgreSQL** (via **Neon**) - A robust relational database with a generous free tier.

#### Trade-offs:
* **Express.js**: Offers flexibility but requires more manual setup compared to opinionated frameworks.

### Frontend
* **Framework**: **ReactJS** - A popular library for building dynamic user interfaces.
* **Build Tool**: **Vite** - Known for its fast development server and hot module replacement.
* **Styling**: **Tailwind CSS** - A utility-first CSS framework for rapid UI development.
* **API Client**: **Axios** - A widely used promise-based HTTP client.

#### Trade-offs:
* **Vite**: While incredibly fast, its ecosystem is still growing.
* **Tailwind CSS**: Requires a learning curve for its utility-first approach, which can lead to verbose class names in JSX if not managed well.

---

## How to Run Locally

This project comprises a backend API and a frontend UI.

### 1. Backend Setup

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/YashwantHabib/clinic-backend.git](https://github.com/YashwantHabib/clinic-backend.git)
    cd clinic-backend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up Environment Variables**: Create a `.env` file in the `clinic-backend` root:
    ```
    DATABASE_URL="postgresql://user:password@host:port/database"
    JWT_SECRET="super_secret"
    PORT=4000
    ```
4.  **Run Prisma Migrations and Seed Database**:
    ```bash
    npx prisma migrate dev --name init
    npm run seed
    ```
5.  **Start the backend server**:
    ```bash
    npm run dev
    ```
    The backend runs on `http://localhost:4000`.

### 2. Frontend Setup

1.  **Navigate to the frontend directory**:
    ```bash
    git clone [https://github.com/YashwantHabib/clinic-frontend.git](https://github.com/YashwantHabib/clinic-frontend.git) # Adjust if different
    cd clinic-frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up Environment Variables**: Create a `.env` file in your frontend root:
    ```
    VITE_API_BASE_URL=http://localhost:4000
    ```
4.  **Start the frontend development server**:
    ```bash
    npm run dev
    ```
    The frontend typically runs on `http://localhost:5173`.

---

## Deployment Steps Taken

The application is deployed using free-tier services:

* **Frontend**: Deployed on **Vercel**.
    * **Build Command**: `npm run build`
    * **Root Directory**: (Left blank)
* **Backend API**: Deployed on **Render**.
    * **Build Command**: `npm install && npm run build`
    * **Start Command**: `npm start`
    * **Node Version**: `22.x.x`
    * **Environment Variables**: Configured on Render for `DATABASE_URL`, `JWT_SECRET`, etc.
    * **Database**: **Neon (PostgreSQL)** was used for the hosted database.

### Important Configuration:
* **CORS**: Configured in the backend to allow requests from the deployed Vercel frontend URL.
* **TypeScript Module Resolution**: `tsconfig.json` was adjusted to output ES Module syntax (`"module": "es2022"`) and all local imports were updated with `.js` extensions (e.g., `import app from './app.js';`) to ensure compatibility with Node.js ES Module resolution on Render.

---

## Architecture Notes

### Folder Structure Rationale

The backend adheres to a layered architecture:
* `src/api/`: Organizes route handlers by feature (auth, bookings, slots).
* `src/lib/`: For utilities and Prisma client instance.
* `src/middlewares/`: Contains Express middleware for authentication.
* `src/server.ts` & `src/app.ts`: Separate server bootstrap from Express app configuration.

This structure enhances modularity, maintainability, and scalability.

### Authentication (Auth) and Role-Based Access Control (RBAC)

* **JWTs**: Generated on login with `userId` and `role`, stored client-side, and sent in `Authorization` headers for protected routes.
* **Middleware**: Verifies JWTs and attaches user info to the request.
* **RBAC**: Checks user's `role` (patient/admin) within route handlers or middleware to enforce access control (e.g., `/api/all-bookings` is admin-only).

### Concurrency/Atomicity for Booking

* **Database-level Unique Constraint**: A `UNIQUE` constraint on `bookings.slotId` in the PostgreSQL database (enforced by Prisma) prevents multiple bookings for the same slot.

This ensures that double-booking is impossible due to the database's integrity checks.

### Error Handling Strategy

* **Standardized API Errors**: Returns appropriate HTTP status codes and consistent JSON error objects `{ "error": { "code": "...", "message": "..." } }`.
* **Input Validation**: Basic validation implemented in route handlers.
* **Frontend Feedback**: API errors are displayed to the user via `alert()` for simplicity.

---

## Quick Verification

Replace `[YOUR_API_URL]` with your deployed backend URL.

1.  **Register a New Patient**:
    ```bash
    curl -X POST ' http://localhost:4000/api/register' \
      -H 'Content-Type: application/json' \
      -d '{
        "name": "Test Patient",
        "email": "test.patient@example.com",
        "password": "SecurePassword123!"
      }'
    ```

2.  **Login (Patient)**:
    ```bash
    curl -X POST ' http://localhost:4000/api/login' \
      -H 'Content-Type: application/json' \
      -d '{
        "email": "test.patient@example.com",
        "password": "SecurePassword123!"
      }'
    # Copy the token
    ```

3.  **Login (Admin)**:
    ```bash
    curl -X POST 'http://localhost:4000/api/login' \
      -H 'Content-Type: application/json' \
      -d '{
        "email": "admin@example.com",
        "password": "Passw0rd!"
      }'
    # Copy the token
    ```

4.  **Get Available Slots (Next 7 Days)**:
    *(Adjust `from` and `to` dates to the current range)*
    ```bash
    curl -X GET 'http://localhost:4000/api/slots?from=2025-08-08&to=2025-08-15' \
      -H 'Content-Type: application/json'
    # Identify a slotId from the response to book
    ```

5.  **Book a Slot (Patient - requires Patient JWT)**:
    ```bash
    curl -X POST 'http://localhost:4000/api/book' \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer [YOUR_PATIENT_JWT]' \
      -d '{
        "slotId": "[SLOT_ID]"
      }'
    ```

6.  **Get My Bookings (Patient - requires Patient JWT)**:
    ```bash
    curl -X GET 'http://localhost:4000/api/my-bookings' \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer [YOUR_PATIENT_JWT]'
    ```

7.  **Get All Bookings (Admin - requires Admin JWT)**:
    ```bash
    curl -X GET 'http://localhost:4000/api/all-bookings' \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer [YOUR_ADMIN_JWT]'
    ```

---

## Known Limitations and What I'd do with 2 More Hours

### Known Limitations:
* **Basic UI/UX**: Minimal styling, lacks advanced features like date pickers and sophisticated loading/notification states (uses `alert()`).
* **Time Zone Handling**: Assumes server local/UTC; explicit client-side timezone conversions are not fully implemented.
* **Input Validation Depth**: Validation is basic; could be more comprehensive.
* **Slot Management**: Slots are generated on the fly; no persistent CRUD for clinic staff to manage slots.
* **No Unbooking/Cancellation**: Patients cannot cancel appointments.

### What I'd do with 2 More Hours:
1.  **Enhanced UI/UX**: Implement date pickers, loading spinners, and toast notifications.
2.  **Unbooking/Cancellation Feature**: Add API endpoint and frontend functionality for booking cancellations.
3.  **Refine Time Zone Logic**: Implement explicit UTC conversions and better display for user local time zones.
4.  **More Robust Input Validation**: Integrate a schema validation library (e.g., `joi`, `zod`) on the backend.
5.  **Basic Rate Limiting**: Add `express-rate-limit` to protect authentication endpoints from brute-force attacks.

---
