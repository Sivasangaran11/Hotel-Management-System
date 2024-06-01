# Hotel Management System

A simple hotel management system built with React (Vite) for the frontend and Express for the backend.

To run the project please follow the Installation Instructions

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>

2. Navigate to the project directory:
    ```bash
    cd hotel-management-system

4. Install dependencies for both frontend and backend:
    ```bash
    npm install --prefix frontend
    npm install --prefix backend

6. To run the project in development mode:
    ```bash
    npm run dev

## Production

1. Build the Frontend:
   ```bash
   npm run build --prefix frontend

2. Start the backend server:
   ```bash
    npm start --prefix backend

## Environment variables

Make sure to set the following environment variables:

# Backend (.env)

- PORT: Port number for the Express server.
- MONGO_URI: MongoDB connection URI.
- JWT_SECRET: Secret key for JWT token.
# Frontend (.env)

- VITE_API_BASE_URL: Base URL for the backend API.

## Contributing

- Contributions are welcome! Please open an issue or submit a pull request with any enhancements or bug fixes.

