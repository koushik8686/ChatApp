This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
# Chat Application

## Overview

This project is a chat application that allows users to connect with experts in real-time. Users can send requests to experts, and once accepted, both parties can engage in a chat. The application also sends email notifications to users when their requests are accepted.

## Features

- Users can send requests to connect with experts.
- Experts can accept or reject connection requests.
- Once accepted, a chat session is created between the user and the expert.
- Email notifications are sent to users when their requests are accepted.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Next.js
- Socket.io
- Nodemailer

## Setup Instructions

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/yourusername/your-repo.git
    cd your-repo
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Environment Variables:**

    Create a `.env` file in the root of the project and add the following environment variables:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password
    ```

4. **Run the Application:**

    ```bash
    npm run dev
    ```

## Directory Structure

