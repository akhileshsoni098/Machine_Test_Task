# Machine Test Task – Node.js Backend API

This project implements the required APIs using **Node.js, Express.js and MongoDB (Mongoose)**.

The APIs include:

1. User Registration
2. Change Users Status
3. Get Distance Between Coordinates
4. Get Users Listing Day Wise

Authentication is implemented using **JWT Token** and passwords are stored using **encrypted hashing**.

---

# Base URL

```
http://localhost:3001
```

---

# 1. Register User

**Endpoint**

```
POST /user/register
```

**URL**

```
http://localhost:3001/user/register
```

**Description**

This API registers a new user and returns a **JWT token** which will be used for authentication in other APIs.

**Request Body**

```json
{
  "name": "rupesh Sharma",
  "email": "rupesh.sharma@example.com",
  "password": "12345678",
  "address": "Lucknow, Uttar Pradesh",
  "latitude": 27.8467,
  "longitude": 82.9462
}
```

**Response**

```json
{
  "status_code": 200,
  "message": "User registered successfully",
  "data": {
    "name": "rupesh Sharma",
    "email": "rupesh.sharma@example.com",
    "address": "Lucknow, Uttar Pradesh",
    "latitude": 27.8467,
    "longitude": 82.9462,
    "status": "active",
    "token": "JWT_TOKEN"
  }
}
```

**Notes**

* Password is stored in **encrypted format (bcrypt)**.
* `status` is **active by default**.
* JWT token is generated during registration.

---

# 2. Change Users Status

**Endpoint**

```
GET /user/status
```

**URL**

```
http://localhost:3001/user/status
```

**Headers**

```
token: JWT_TOKEN
```

**Description**

This API toggles the status of all users.

* If status is **active → inactive**
* If status is **inactive → active**

The operation is performed using a **single database query without loops**.

**Response**

```json
{
  "status_code": 200,
  "message": "All users status updated successfully"
}
```

---

# 3. Get Distance

**Endpoint**

```
GET /user/distance
```

**URL**

```
http://localhost:3001/user/distance
```

**Headers**

```
token: JWT_TOKEN
```

**Query Parameters**

| Parameter       | Type   | Description           |
| --------------- | ------ | --------------------- |
| destinationLat  | Number | Destination latitude  |
| destinationLong | Number | Destination longitude |

Example:

```
http://localhost:3001/user/distance?destinationLat=25.7041&destinationLong=79.1025
```

**Description**

This API calculates the distance between:

* User's stored latitude & longitude
* Destination latitude & longitude

Distance is calculated using the **Haversine formula**.

**Response**

```json
{
  "status_code": 200,
  "message": "Distance calculated successfully",
  "distance": "120.45 km"
}
```

---

# 4. Get Users Listing Day Wise

**Endpoint**

```
GET /user/listing
```

**URL**

```
http://localhost:3001/user/listing
```

**Headers**

```
token: JWT_TOKEN
```

**Query Parameters**

| Parameter   | Example |
| ----------- | ------- |
| week_number | 2,3     |

Example Request

```
http://localhost:3001/user/listing?week_number=2,3
```

**Description**

This API returns users grouped by the **day they registered**.

Users are filtered using the provided `week_number`.

Example:

```
week_number = 2,3
```

Returns users registered on **Tuesday and Wednesday**.

---

# Week Number Mapping

```
0 = Sunday
1 = Monday
2 = Tuesday
3 = Wednesday
4 = Thursday
5 = Friday
6 = Saturday
```

---

# Example Response

```json
{
  "status_code": 200,
  "message": "User listing fetched successfully",
  "data": {
    "tuesday": [
      {
        "name": "Rupesh",
        "email": "rupesh@gmail.com"
      }
    ],
    "wednesday": [
      {
        "name": "Aman",
        "email": "aman@gmail.com"
      }
    ]
  }
}
```

---

# Authentication

All protected APIs require a **JWT Token**.

Pass token in request header:

```
token: JWT_TOKEN
```

---

# Technology Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt Password Encryption

---

# Performance Considerations

* Index added on `createdAt` for faster day-based queries.
* Aggregation pipeline used for efficient grouping of users.
* Query optimized to support **large scale datasets (1 Crore users)**.

---
