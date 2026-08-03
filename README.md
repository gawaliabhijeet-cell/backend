# 🔐 Node.js Authentication Backend API

A secure backend authentication system built with **Node.js**, **Express.js**, **MongoDB**, and **JWT**. This project implements user authentication using **Access Tokens** and **Refresh Tokens**, supports image uploads with **Cloudinary**, and follows production-ready backend practices.

---

# eraser 
- entity Relationship Diagram [click me](https://app.eraser.io/workspace/yyXNu1BN0M43gY0x9ClL?origin=share&diagram=B2QskPe1fUDFA8-6XaOix
)


# 🚀 Features

* ✅ User Registration
* ✅ User Login
* ✅ User Logout
* ✅ JWT Authentication
* ✅ Refresh Access Token
* ✅ Password Hashing using bcrypt
* ✅ Secure HTTP-Only Cookies
* ✅ Avatar & Cover Image Upload
* ✅ Cloudinary Integration
* ✅ MongoDB Database
* ✅ Centralized Error Handling
* ✅ Standard API Responses
* ✅ Async Error Wrapper
* ✅ REST API Architecture

---

# 🛠 Tech Stack

| Technology    | Purpose               |
| ------------- | --------------------- |
| Node.js       | JavaScript Runtime    |
| Express.js    | Backend Framework     |
| MongoDB       | Database              |
| Mongoose      | MongoDB ODM           |
| JWT           | Authentication        |
| bcrypt        | Password Hashing      |
| Multer        | File Upload           |
| Cloudinary    | Cloud Image Storage   |
| Cookie Parser | Cookie Handling       |
| CORS          | Cross-Origin Requests |
| dotenv        | Environment Variables |

---

# 📁 Project Structure

```text
project/
│
├── public/
│   └── temp/
│
├── src/
│   ├── controllers/
│   │      user.controller.js
│   │
│   ├── db/
│   │      index.js
│   │
│   ├── middlewares/
│   │      auth.middleware.js
│   │
│   ├── models/
│   │     
│   │     
│   │
│   ├── routes/
│   │      user.routes.js
│   │
│   ├── utils/
│   │      ApiError.js
│   │      ApiResponse.js
│   │      asyncHandler.js
│   │      cloudinary.js
│   │
│   ├── app.js
│   └── index.js
│
├── .env
├── package.json
└── README.md
```

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/gawaliabhijeet-cell/backend.git
```

Move into the project folder

```bash
cd backend
```

Start the development server

```bash
npm run dev
```

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory.

```env
PORT=8000

MONGODB_URI=your_mongodb_uri
DB_NAME=your_database_name

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d

CORS_ORIGIN=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# 🔑 Authentication Flow

```text
User Register
      │
      ▼
Password Hashing
      │
      ▼
Store User in MongoDB
      │
      ▼
User Login
      │
      ▼
Verify Password
      │
      ▼
Generate Access Token
Generate Refresh Token
      │
      ▼
Store Refresh Token
      │
      ▼
Send HTTP-Only Cookies
      │
      ▼
Protected Routes
      │
      ▼
Access Token Expired
      │
      ▼
Refresh Token Endpoint
      │
      ▼
Generate New Access Token
```

---

# 📌 API Endpoints

## Authentication

### Register User

```
POST /api/v1/users/register
```

Uploads:

* Avatar (Required)
* Cover Image (Optional)

---

### Login User

```
POST /api/v1/users/login
```

Returns

* Access Token
* Refresh Token
* User Details

---

### Logout User

```
POST /api/v1/users/logout
```

* Removes Refresh Token
* Clears Cookies

---

### Refresh Access Token

```
POST /api/v1/users/refresh-token
```

Creates

* New Access Token
* New Refresh Token

---

# 📤 Request Example

## Register

```json
{
    "fullName":"John Doe",
    "username":"john123",
    "email":"john@gmail.com",
    "password":"12345678"
}
```

---

## Login

```json
{
    "email":"john@gmail.com",
    "password":"12345678"
}
```

---

# 📥 Success Response

```json
{
    "statusCode":200,
    "success":true,
    "message":"User logged in successfully",
    "data":{
        "user":{
            "_id":"12345",
            "username":"john123",
            "email":"john@gmail.com"
        },
        "accessToken":"JWT_TOKEN",
        "refreshToken":"JWT_TOKEN"
    }
}
```

---

# 🔒 Security Features

* Password hashing using bcrypt
* JWT Authentication
* HTTP-Only Cookies
* Secure Cookies
* Refresh Token Rotation
* MongoDB Validation
* Duplicate User Checking
* Centralized Error Handling
* Protected Routes
* Environment Variables

---

# 📷 Image Upload

Images are uploaded using **Multer**.

Temporary files are stored in:

```text
public/temp
```

Then uploaded to **Cloudinary**, and the local temporary file is removed after upload.

---

# 📚 Database Models

## User Model

* Full Name
* Username
* Email
* Password (Hashed)
* Avatar
* Cover Image
* Refresh Token
* Watch History

### User Methods

* `isPasswordCorrect()`
* `generateAccessToken()`
* `generateRefreshToken()`

---

## Video Model

* Video URL
* Thumbnail
* Title
* Description
* Duration
* Views
* Owner
* Publish Status

Uses

```
mongoose-aggregate-paginate-v2
```

for aggregation pagination.

---

# 🧰 Utilities

### asyncHandler

Automatically catches async errors.

### ApiError

Creates consistent error responses.

### ApiResponse

Creates standard success responses.

### Cloudinary Utility

Uploads images to Cloudinary.

---

# 📌 HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Resource Created      |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 404  | Not Found             |
| 409  | Conflict              |
| 500  | Internal Server Error |

---

# 🧪 Testing

You can test all endpoints using:

* Postman


---

# 📖 Future Improvements

* Email Verification
* Forgot Password
* Reset Password
* OTP Authentication
* Google OAuth Login
* GitHub OAuth Login
* Role-Based Authorization
* User Profile Update
* Video Like & Comment System
* Watch History
* Subscription System

---

# 👨‍💻 Author

**Abhijeet Gawali**

* Diploma Student (Computer Engineering)
* Backend Developer (Node.js & Express.js)
* Learning MongoDB, JWT Authentication, React, and Full-Stack Development

---

# ⭐ Support

If you found this project useful:

* ⭐ Star the repository
* 🍴 Fork the project
* 🛠 Contribute with pull requests

Happy Coding! 🚀




