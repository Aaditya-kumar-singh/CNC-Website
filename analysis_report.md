# CNC Marketplace Architecture & Issues Analysis

## Global User Rule Constraints Validation
- **Rule 1**: `always migrate api have same core logic and have one-two-one mapping with old api` 
- **Rule 2**: `all the small validation should be done at controller level, only business logic should be in service`

## System Architecture

The application is a standard MERN stack web app.
### Backend Stack:
- Express / Node.js
- MongoDB / Mongoose
- Models: User, Design, Order, Review, Bundle
- Cloudinary (for image previews & watermarks)
- Cloudflare R2 / AWS S3 SDK (for CNC file storage and signed URLs)
- Razorpay setup for processing payments

## Current Issues & Bugs

### 1. Architectural & Validation Rule Violations
Based on the global user rule: "all the small validation should be done at controller level, only business logic should be in service". 
- **[auth.controller.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/auth.controller.js)**: Mostly follows the rules but contains some basic regex checking.
- **[design.controller.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/design.controller.js)**: Handles validation like checking `req.files` and `!id.match(/.../)`. This is correct based on rules. 
- **[auth.service.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/auth.service.js)**: 
  - Throws errors for `cart` limits and `wishlist` limits. **Rule Violation**: Checking if cart length >= 50 or wishlist length >= 100 should ideally be validated in the controller before hitting the DB service.
- **[review.service.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/review.service.js)**:
  - Validates if the user has purchased the item and checks for duplicate reviews manually. This blurs the line slightly between business logic and validation, but checking DB state is acceptable business logic.

### 2. Missing Reference Validation
Several controllers fail to properly validate ObjectIds, though many were allegedly fixed by previous comments.
- **[design.controller.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/design.controller.js)**: [getDesign](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/design.controller.js#22-44) and [updateDesign](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/design.service.js#102-106) have a regex fix for `^[0-9a-fA-F]{24}$`.
- **[download.controller.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/download.controller.js)**: Fails to validate that `req.params.designId` is a valid ObjectId format before calling `Design.findById`. If the user passes `abc`, it will throw a 500 Mongoose CastError.
- **[review.controller.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/review.controller.js)**: [getDesignReviews](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/review.service.js#42-49) does not validate if `designId` is a valid ObjectId format.

### 3. Payment System & Bundles
- The [Order](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/payment.controller.js#5-37) model includes a `bundleId` property.
- However, [payment.controller.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/payment.controller.js) ([createOrder](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/payment.controller.js#5-37) and [verifyPayment](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/payment.controller.js#38-66)) and [payment.service.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/payment.service.js) completely ignore bundles. They only look at an array of `designIds`. If a user attempts to buy a bundle, it seems there is no logic to process `bundleId`, assign bundle price, or grant access to the designs inside the bundle.

### 4. Downloading Designs Architecture
- [download.service.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/download.service.js) attempts to handle subscriptions (e.g. `userDoc.downloadsRemaining > 0`). However, it modifies the database directly inside a `GET` download process limit check. 
  - **Issue**: If a user generates a download link but their internet disconnects before downloading, their `downloadsRemaining` counter has already been decremented. 
  - **Issue**: Modifying DB state inside a GET request violates REST principles.

### 5. Bundle Model & Controller
- [bundle.controller.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/bundle.controller.js) has no validators for checking the content on [createBundle](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/bundle.controller.js#23-31). It directly passes `req.body` to `bundleService.createBundle(req.body)`. This completely violates the global user rule of having validation in the controller.
- It doesn't check if the design IDs inside the bundle actually exist in the database.

### 6. Search Injection Vulnerability
- Backing up [admin.service.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/admin.service.js), the regex search `$regex: escaped` fixed the injection for search.
- But look at [design.service.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/design.service.js) around line 24. It creates `new RegExp(\\${fileType}$, 'i')`. Since `fileType` is passed straight from `req.query`, an attacker could pass a malicious regex payload via `?fileType=` to cause a ReDoS (Regular Expression Denial of Service).

### 7. Razorpay Order Status Verification
- In [review.service.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/review.service.js) line 18, it searches for orders with `paymentStatus: 'success'`. This matches the model.
- However, in other places, Razorpay logic verifies the signature but doesn't actually hit the Razorpay API to confirm the `paymentId` status. It just trusts the client-side returned signature. While HMAC verification is secure, it is a best practice to cross-verify the status with Razorpay servers to fully guarantee the funds captured, but this is optional.

### 8. Hardcoded Defaults
- [email.service.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/email.service.js) hardcodes `EMAIL_HOST` to `'sandbox.smtp.mailtrap.io'`.

## Needed Fixes

1. Move maximum bounds checking (Cart/Wishlist limit of 50/100) from [auth.service.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/auth.service.js) into the respective [auth.controller.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/auth.controller.js) methods ([toggleWishlist](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/auth.service.js#29-49), [toggleCart](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/auth.service.js#59-79)).
2. Add ObjectId format validation to [download.controller.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/download.controller.js) and [review.controller.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/review.controller.js).
3. Re-think the Subscription deduction logic in [download.service.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/download.service.js).
4. Fix the ReDoS vulnerability in [design.service.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/design.service.js) for the `fileType` filter.
5. Add full validation to [bundle.controller.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/bundle.controller.js) matching `req.body` properties.
6. Integrate `bundleId` processing into the payment gateway controllers.

---

## Additional Bugs Found (Extended Analysis)

### 9. Broken Storage and Signed URL Integration
- CNC files are uploaded to **Cloudflare R2** via [uploadToR2.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/utils/uploadToR2.js).
- Download links are generated via **Cloudinary** ([generateSignedUrl.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/utils/generateSignedUrl.js)), which knows nothing about R2.
- Every download link is **broken** — Cloudinary cannot sign a URL for a file it doesn't host.
- **Fix**: [generateSignedUrl.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/utils/generateSignedUrl.js) must use `@aws-sdk/s3-request-presigner` with the R2 S3 client.

### 10. Memory Constraints in Multer Buffer
- [multer.middleware.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/middlewares/multer.middleware.js) buffers CNC files **entirely in memory** before upload.
- A 50MB CNC file fully occupies RAM. Under concurrent uploads this crashes the server.
- **Fix**: Use `multer.diskStorage()` to write temp files to disk, then stream to R2.

### 11. XSS Sanitizer Bypass for Form-Data
- The XSS sanitizer middleware runs **before** multer processes `multipart/form-data`.
- At that point `req.body` is empty — text fields in upload forms bypass sanitization entirely.
- **Fix**: Apply XSS sanitization after multer processes the request, or inside the controller.

### 12. Inconsistent State in Payment Verification
- [payment.service.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/payment.service.js) marks the order `paymentStatus: 'success'` before verifying user ownership.
- If user lookup fails after this, the order is permanently stuck in a success state with no owner.
- **Fix**: Verify ownership first, then update payment status atomically.

### 13. Infinite Email Spam Loop in Cron Job
- [abandonedCart.job.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/cron/abandonedCart.job.js) resets `lastAbandonedCartEmailSentAt` and re-sends every 24 hours.
- A user whose cart is never emptied receives the abandoned cart email **forever**.
- **Fix**: Add a max-send counter (e.g. max 3 emails), or only target carts newer than 7 days.

### 14. Global Error Handler Bypass
- Many controllers use [serverError(res, error)](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/utils/responseHandler.js#14-19) directly instead of `return next(error)`.
- This bypasses the global error handler in [app.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/app.js) which handles CastError, ValidationError, JWT errors.
- These errors get raw 500 responses instead of clean client-friendly messages.
- **Fix**: Replace all [serverError(res, error)](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/utils/responseHandler.js#14-19) with `return next(error)`.

### 15. Mass Assignment on Bundle Creation
- [bundle.controller.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/bundle.controller.js) passes `req.body` directly to `bundleService.createBundle(req.body)`.
- An attacker can inject extra fields (e.g. `isActive: false`, `price: 0`) into the bundle document.
- **Fix**: Destructure only allowed fields in the controller before passing to the service.

### 16. Race Condition in Download Counter (Resolved — subscription removed)
- The old [download.service.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/download.service.js) used an in-memory read→modify→save for `downloadsRemaining`.
- Two concurrent requests could both read `downloadsRemaining = 1`, both decrement, both succeed.
- **Fix applied**: Subscription logic removed entirely. Atomic `$inc` should be used if re-added.

### 17. Unbounded Memory Fetching in Reviews
- [review.controller.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/controllers/review.controller.js) fetches **all reviews** for a design with no pagination.
- A design with 10,000 reviews loads all of them into memory on every single request.
- **Fix**: Add `.limit()` and `.skip()` with page/total in the response.

---

## 🚀 Production Improvements — Technologies to Add

> Already present in CNC project: **Helmet · CORS with credentials · Morgan · Rate Limiting · HPP · Mongo Sanitize · Global Error Handler · Env Validation · Graceful Shutdown**

### 1. 📋 Winston — Structured Production Logger
Replace the remaining `console.log` / `console.error` calls with file-based structured logging.

```bash
npm install winston
```

```js
// src/config/logger.js
const winston = require('winston');
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
module.exports = logger;
```

Replace in [app.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/app.js) line 187:
```js
// ❌ CURRENT
console.error('Unhandled Server Error:', err);
// ✅ FIX
logger.error({ message: err.message, stack: err.stack, url: req.originalUrl });
```

---

### 2. 🗜️ Response Compression
Compress all API responses — reduces bandwidth by **60–80%**. One line of code.

```bash
npm install compression
```

```js
// In app.js — add before routes
const compression = require('compression');
app.use(compression({ level: 6, threshold: 1024 }));
```

---

### 3. ⚡ Redis Caching — Cache Design Listings
Cache popular/category listings for 5 minutes so MongoDB isn't hit on every request.

```bash
npm install ioredis
```

```js
// src/middlewares/cache.middleware.js
const redis = require('../config/redis');
const cacheDesigns = async (req, res, next) => {
  const key = `designs:${JSON.stringify(req.query)}`;
  try {
    const cached = await redis.get(key);
    if (cached) return res.json(JSON.parse(cached));
  } catch (_) {}
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    redis.setex(key, 300, JSON.stringify(data)).catch(() => {});
    return originalJson(data);
  };
  next();
};
```

Apply in [design.routes.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/routes/design.routes.js):
```js
router.get('/', cacheDesigns, designController.getAllDesigns);
```

> Free Redis: [Upstash](https://upstash.com) — serverless, free tier, no server needed.

---

### 4. ✅ Input Validation with Zod
Replace all manual `if (!field)` checks with type-safe schema validation.

```bash
npm install zod
```

```js
// src/validators/design.validator.js
const { z } = require('zod');
const createDesignSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  price: z.coerce.number().min(0).max(100000),
  category: z.enum(['3d-designs', '2d-designs', '3d-doors-design',
    '2d-grill-designs', '2d-door-designs', 'temple-designs', '3d-traditional', 'other']),
});

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.errors[0].message });
  req.body = result.data; // returns sanitized, typed data
  next();
};
module.exports = { createDesignSchema, validate };
```

---

### 5. 📜 Download History Tracking
Track what each user downloaded and when — enables re-download UX.

Add to [User.model.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/models/User.model.js):
```js
downloadHistory: [{
  design: { type: mongoose.Schema.ObjectId, ref: 'Design' },
  downloadedAt: { type: Date, default: Date.now }
}],
```

Update [download.service.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/services/download.service.js) after URL generation:
```js
await User.findByIdAndUpdate(user._id, {
  $push: { downloadHistory: { $each: [{ design: design._id }], $slice: -100 } }
});
await Design.findByIdAndUpdate(design._id, { $inc: { downloads: 1 } });
```

New route: `GET /api/v1/auth/download-history`

---

### 6. 🔔 Stripe Webhook — Bulletproof Payment Fulfillment
Server-side confirmation via `checkout.session.completed` event.

```js
// Route — must use raw body for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Controller
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
  if (event.type === 'checkout.session.completed') {
    await paymentService.fulfillOrder(event.data.object);
  }
  res.json({ received: true });
};
```

---

### 7. 🏥 Improved Health Check
Add DB connection state + uptime to the health endpoint for monitoring tools (UptimeRobot, BetterStack).

```js
app.get('/api/health', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: dbStatus[dbState],
    environment: process.env.NODE_ENV,
  });
});
```

---

### 8. 🔒 Refresh Token System
15-min access tokens + 7-day refresh token in httpOnly cookie — reduces attack window from 7 days to 15 minutes if a token is stolen.

- Add `refreshToken: { type: String, select: false }` to [User.model.js](file:///c:/Users/hp/Desktop/CNC-Designe/backend/src/models/User.model.js)
- New route: `POST /api/v1/auth/refresh`
- Refresh token is one-time use — rotate on every refresh (prevents replay attacks)

---

## 📦 Recommended Install Order

| Priority | Package | Command | Impact |
|---|---|---|---|
| 🟠 1st | `compression` | `npm install compression` | Instant 60% bandwidth drop, 1 line |
| 🟠 2nd | `winston` | `npm install winston` | Production-grade error logging |
| 🟡 3rd | `zod` | `npm install zod` | Clean schema-driven validation |
| 🟡 4th | `ioredis` | `npm install ioredis` | Zero DB load on repeated queries |
