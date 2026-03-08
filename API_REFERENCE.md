# CNC Market — API Reference (Postman Testing Guide)

**Base URL:** `http://localhost:5000/api/v1`

> **Auth:** Protected routes require a `Bearer` token in the `Authorization` header.
> Get the token from the Login or Register response and set it as:
> ```
> Authorization: Bearer <your_token_here>
> ```

---

## 🔐 AUTH — `/api/v1/auth`

### 1. Register a New User
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `http://localhost:5000/api/v1/auth/register` |
| **Auth** | None |
| **Body Type** | `raw → JSON` |

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response `201`:**
```json
{
  "status": "success",
  "token": "<jwt_token>",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

**Error Responses:**
- `400` — `"Please provide your name"` / Duplicate email

---

### 2. Login
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `http://localhost:5000/api/v1/auth/login` |
| **Auth** | None |
| **Body Type** | `raw → JSON` |

**Request Body:**
```json
{
  "email": "aaditya@example.com",
  "password": "password123"
}
```

**Success Response `200`:**
```json
{
  "status": "success",
  "token": "<jwt_token>",
  "data": {
    "user": {
      "_id": "...",
      "name": "Aaditya",
      "email": "aaditya@example.com",
      "role": "admin"
    }
  }
}
```

**Error Responses:**
- `400` — `"Please provide email and password"`
- `401` — `"Incorrect email or password"`

---

### 3. Get Current User (Me)
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `http://localhost:5000/api/v1/auth/me` |
| **Auth** | ✅ Bearer Token Required |
| **Body** | None |

**Success Response `200`:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "...",
      "name": "Aaditya",
      "email": "aaditya@example.com",
      "role": "admin",
      "purchasedDesigns": []
    }
  }
}
```

**Error Responses:**
- `401` — `"You are not logged in. Please log in to get access."`

---

## 🎨 DESIGNS — `/api/v1/designs`

### 4. Get All Designs (Public)
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `http://localhost:5000/api/v1/designs` |
| **Auth** | None |
| **Body** | None |

**Success Response `200`:**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "designs": [
      {
        "_id": "...",
        "title": "Wooden Elephant Puzzle",
        "description": "...",
        "price": 299,
        "previewImages": ["https://cloudinary.com/..."],
        "uploadedBy": { "name": "Aaditya" }
      }
    ]
  }
}
```

---

### 5. Get Single Design (Public)
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `http://localhost:5000/api/v1/designs/:id` |
| **Auth** | None |
| **Body** | None |

**Example URL:** `http://localhost:5000/api/v1/designs/65f123abc456def789012345`

**Error Responses:**
- `404` — `"No design found with that ID"`

---

### 6. Upload a New Design ⚠️ Admin Only
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `http://localhost:5000/api/v1/designs` |
| **Auth** | ✅ Bearer Token (Admin only) |
| **Body Type** | `form-data` *(NOT raw JSON — files required!)* |

**Form-Data Fields:**

| Key | Type | Value |
|-----|------|-------|
| `title` | Text | `Wooden Elephant Puzzle` |
| `description` | Text | `Premium CNC-ready DXF file...` |
| `price` | Text | `299` |
| `preview` | File | *(Select an image file — JPG/PNG, max 2MB)* |
| `cnc` | File | *(Select a CNC file — ZIP/DXF/STL, max 50MB)* |

**Success Response `201`:**
```json
{
  "status": "success",
  "data": {
    "design": {
      "_id": "...",
      "title": "Wooden Elephant Puzzle",
      "price": 299,
      "previewImages": ["https://res.cloudinary.com/..."],
      "fileKey": "designs/uuid.zip"
    }
  }
}
```

**Error Responses:**
- `400` — `"Please provide both a preview image and the CNC file."`
- `403` — `"You do not have permission to perform this action"`
- `401` — `"You are not logged in. Please log in to get access."`

---

## 💳 PAYMENTS — `/api/v1/payments`

> All payment routes require a valid Bearer token.

### 7. Create Razorpay Order
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `http://localhost:5000/api/v1/payments/orders` |
| **Auth** | ✅ Bearer Token Required |
| **Body Type** | `raw → JSON` |

**Request Body:**
```json
{
  "designId": "65f123abc456def789012345"
}
```

**Success Response `200`:**
```json
{
  "status": "success",
  "order": {
    "id": "order_razorpay_id",
    "amount": 29900,
    "currency": "INR",
    "status": "created"
  }
}
```

**Error Responses:**
- `404` — `"Design not found"`
- `400` — `"Design is free. Use direct download."`

---

### 8. Verify Razorpay Payment Signature
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `http://localhost:5000/api/v1/payments/verify` |
| **Auth** | ✅ Bearer Token Required |
| **Body Type** | `raw → JSON` |

**Request Body:**
```json
{
  "razorpay_order_id": "order_...",
  "razorpay_payment_id": "pay_...",
  "razorpay_signature": "generated_hmac_signature"
}
```

**Success Response `200`:**
```json
{
  "status": "success",
  "message": "Payment verified successfully"
}
```

**Error Responses:**
- `400` — `"Invalid signature. Payment failed"`

---

## 📥 DOWNLOADS — `/api/v1/downloads`

### 9. Get Secure Download Link
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `http://localhost:5000/api/v1/downloads/:designId` |
| **Auth** | ✅ Bearer Token Required |
| **Body** | None |

**Example URL:** `http://localhost:5000/api/v1/downloads/65f123abc456def789012345`

**Success Response `200`:**
```json
{
  "status": "success",
  "data": {
    "downloadUrl": "https://r2.cloudflarestorage.com/...?X-Amz-Signature=...&X-Amz-Expires=60"
  }
}
```

**Access Rules:**
- Free designs → Any logged-in user can download
- Paid designs → Only the **owner** or users who **purchased** it can download

**Error Responses:**
- `403` — `"Please purchase this design to download"`
- `404` — `"Design not found"`

---

## 🛡️ ADMIN — `/api/v1/admin`

> All admin routes require a valid Bearer token **AND** `role: "admin"`.

### 10. Get Platform Dashboard Stats
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `http://localhost:5000/api/v1/admin/stats` |
| **Auth** | ✅ Bearer Token (Admin only) |
| **Body** | None |

**Success Response `200`:**
```json
{
  "status": "success",
  "data": {
    "counts": {
      "users": 5,
      "designs": 12
    },
    "revenue": 4500,
    "storage": {
      "mongodb": {
        "dataSize": "0.42",
        "storageSize": "0.80",
        "totalLimit": "512"
      },
      "cloudinary": {
        "status": "Active",
        "plan": "free",
        "bandwidth": "12.50",
        "storage": "8.30"
      },
      "r2": {
        "status": "Active",
        "totalFiles": 12,
        "totalSize": "142.50"
      }
    }
  }
}
```

**Error Responses:**
- `403` — `"You do not have permission to perform this action"`

---

## 🚀 Quick Postman Setup

1. Create a **Collection** called `CNC Market API`
2. Add a **Collection Variable** called `token` (empty by default)
3. In the **Login request → Tests tab**, add:
```javascript
const res = pm.response.json();
pm.collectionVariables.set("token", res.token);
```
4. For all protected routes, set **Authorization → Bearer Token → `{{token}}`**
5. Now login once and all other requests auto-use the token!

---

*Generated: 2026-02-25 | Backend: Express v5 + MongoDB Atlas + Cloudinary + Cloudflare R2*
