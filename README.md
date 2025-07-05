# Messenger API Server

This is the backend server for a real-time chat application, built with Node.js, Express, and MongoDB. It handles user authentication, friend management, group chats, and message exchange.

## Features

- User Authentication (Register, Login, Forgot Password, Reset Password, Change Password)
- User Profile Management (Update Name, Profile Photo)
- Friend Management (Send, Accept, Reject, Cancel Friend Requests, Unfriend, Block, Unblock Users)
- Group Chat Management (Create, Add/Remove Members)
- Real-time Messaging (Send, Edit, Delete Messages)

## Installation

To set up the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd messenger/server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the `server` directory with the following content:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    EMAIL_USERNAME=your_email@gmail.com
    EMAIL_PASSWORD=your_email_password
    EMAIL_FROM=your_email@gmail.com
    ```
    Replace the placeholder values with your actual MongoDB connection string, a strong JWT secret, and your Gmail credentials for password reset functionality.

4.  **Run the development server:**
    ```bash
    npm start
    ```
    The server will run on `http://localhost:5000` (or the port specified in your environment).

## API Endpoints

The API endpoints are documented using OpenAPI (Swagger). You can find the full specification in `openapi.yaml` in the project root.

Key endpoint categories include:

-   `/api/users`: User registration, login, profile management, and friend requests.
-   `/api/groups`: Group creation and member management.
-   `/api/messages`: Sending, editing, and deleting messages.

For detailed request/response schemas and authentication requirements, refer to the `openapi.yaml` file.

## Running Tests

To run the automated tests for the API, use the following command:

```bash
npm test
```

This will execute all tests located in the `test/` directory.
