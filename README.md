# project-management-auth-service

Authentication service for a project management application.

## Table of Contents

-   [Introduction](#introduction)
-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
-   [API Endpoints](#api-endpoints)
-   [Configuration](#configuration)

## Introduction

The Project Management Auth Service is a microservice responsible for handling authentication and authorization for a project management application. It provides secure login, registration, and token management functionalities.

## Features

-   User registration and login
-   JWT token generation and validation
-   Password hashing and verification
-   Role-based access control (to be implemented)

## Installation

To install and run the service locally, follow these steps:

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/project-management-auth-service.git
    cd project-management-auth-service
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary configuration variables (see [Configuration](#configuration)).

4. Start the service:
    ```sh
    npm start
    ```

## Usage

Once the service is running, you can interact with it using HTTP requests. Below are the available endpoints.

## API Endpoints

-   `POST /register` - Register a new user
-   `POST /login` - Authenticate a user. Returns a JWT acess token and a httpOnly cookie with the refresh token
-   `POST /logout` - Log out the authenticated user
-   `POST /refresh` - Refresh the access token

## Configuration

The service requires the following environment variables to be set:

-   `MONGO_URL` - Database connection string
-   `NODE_ENV` - Environment the service will be run in
-   `COOKIE_SECRET` - Secret for cookie-parser middleware
-   `ACCESS_TOKEN_SECRET` - Secret for encoding/decoding access token
-   `REFRESH_TOKEN_SECRET` - Secret for encoding/decoding refresh token
-   `JWT_ISSUER` - Service issuing the JWT
-   `REFRESH_TOKEN_TTL` - Time to live of the refresh token (default: 1d)
-   `ACCESS_TOKEN_TTL` - Time to live of the access token (default: 15m)
-   `JWT_AUDIENCE` - Intended consuming host

Example `.env` file:

```env
MONGO_URL=mongodb://localhost:27017
COOKIE_SECRET=your_jwt_secret
NODE_ENV=development
...
```

To generate secrets for the `.env` you can use the following code in Node REPL:

```javascript
require('crypto').randomBytes(256).toString('base64');
```
