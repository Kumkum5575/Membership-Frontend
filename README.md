# Invitation-Based Membership & Waiting List Management

A web-based platform designed to manage membership applications through an invitation-based registration system.

## Features

* Public homepage accessible without login.
* Invitation-based membership registration.
* Secure authentication and role-based access.
* Applicant dashboard to track application status.
* Admin dashboard to manage applications.
* Approve, reject, and review membership applications.
* Invitation generation and usage limit management.
* Invitation revocation and expiry handling.
* Member suspension and reactivation.
* Notifications for application status updates.
* Audit logs for administrative activities.
* Applicant privacy and protected routes.

## Technology Stack

* React.js
* Vite
* JavaScript
* CSS
* Axios
* React Router DOM
* Node.js and Express.js (Backend API)
* MongoDB (Database)

## Installation and Setup

1. Clone the repository.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend root directory:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## Environment Variables

| Variable     | Description          |
| ------------ | -------------------- |
| VITE_API_URL | Backend API base URL |

## Backend

The backend is maintained separately and provides authentication, invitation management, application processing, notifications, and administrative APIs.

## Project Status

Developed as part of a technical assessment.
